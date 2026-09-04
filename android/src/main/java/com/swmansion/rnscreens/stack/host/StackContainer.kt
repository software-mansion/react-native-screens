package com.swmansion.rnscreens.stack.host

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import android.widget.FrameLayout
import androidx.activity.OnBackPressedCallback
import androidx.activity.OnBackPressedDispatcher
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import com.swmansion.rnscreens.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeCoordinator
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeListener
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeProviding
import com.swmansion.rnscreens.common.container.Container
import com.swmansion.rnscreens.common.container.ContainerItem
import com.swmansion.rnscreens.common.container.ParentContainerItemRegistry
import com.swmansion.rnscreens.ext.isMeasured
import com.swmansion.rnscreens.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.helpers.FragmentManagerWithOwner
import com.swmansion.rnscreens.helpers.ViewIdGenerator
import com.swmansion.rnscreens.stack.header.StackHeaderBackPressHandler
import com.swmansion.rnscreens.stack.screen.StackScreen
import com.swmansion.rnscreens.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.stack.screen.StackScreenFragmentDelegate
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
internal class StackContainer(
    context: Context,
    private val delegate: WeakReference<StackContainerDelegate>,
) : FrameLayout(context),
    Container,
    FragmentManager.OnBackStackChangedListener,
    ColorSchemeProviding,
    StackHeaderBackPressHandler,
    StackScreenFragmentDelegate {
    private var fragmentManager: FragmentManager? = null

    private fun requireFragmentManager(): FragmentManager =
        checkNotNull(fragmentManager) { "[RNScreens] Attempt to use nullish FragmentManager" }

    /**
     * Will crash in case parent does not implement StackContainerParent interface.
     */
    private fun containerParentOrNull(): StackContainerParent? = this.parent as StackContainerParent?

    private val parentContainerRegistry = ParentContainerItemRegistry()

    /**
     * Describes most up-to-date view of the stack. It might be different from
     * state kept by FragmentManager as this data structure is updated immediately,
     * while operations on fragment manager are scheduled.
     */
    private val stackModel: MutableList<StackScreenFragment> = arrayListOf()

    private val pendingPopOperations: MutableList<PopOperation> = arrayListOf()
    private val pendingPushOperations: MutableList<PushOperation> = arrayListOf()
    private val hasPendingOperations: Boolean
        get() = pendingPushOperations.isNotEmpty() || pendingPopOperations.isNotEmpty()

    private val fragmentOpExecutor: FragmentOperationExecutor = FragmentOperationExecutor()
    private val fragmentOps: MutableList<FragmentOperation> = arrayListOf()

    // region Color Scheme

    private val colorSchemeCoordinator = ColorSchemeCoordinator()

    internal var colorScheme: ColorScheme by colorSchemeCoordinator::colorScheme

    override fun getResolvedUiNightMode() = colorSchemeCoordinator.getResolvedUiNightMode()

    override fun addColorSchemeListener(listener: ColorSchemeListener) =
        colorSchemeCoordinator.addColorSchemeListener(listener)

    override fun removeColorSchemeListener(listener: ColorSchemeListener) =
        colorSchemeCoordinator.removeColorSchemeListener(listener)

    // endregion

    init {
        id = ViewIdGenerator.generateViewId()
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackContainer [$id] attached to window")
        super.onAttachedToWindow()

        parentContainerRegistry.attach(this)
        setupFragmentManger()

        // StackContainer only provides container-level color scheme configuration for its screens
        // but doesn't use any color scheme-dependent views, so we don't need the callback.
        colorSchemeCoordinator.setup(this, null)

        // Following line works with a couple of assumptions.
        // First, that this view is laid out by our parent view, which is a component view.
        // Component views on new architecture receive their first layout after the view hierarchy is
        // assembled and attached to window. Note, that in case of screen views & their subtrees
        // (including nested containers) this does not hold. The container is updated later, therefore
        // the views are attached to window much later ==> their isLaidOut returns false, breaking
        // transitions & animations.
        updateLaidOutFlagIfNeededAndPossible()

        // We run container update to handle any pending updates requested before container was
        // attached to window.
        performContainerUpdateIfNeeded()

        // Covers re-attach with a surviving stack (nothing pending above) and lets the containers
        // above know that this subtree is back.
        invalidateSystemBackVetoState()
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        requireFragmentManager().removeOnBackStackChangedListener(this)
        fragmentManager = null
        teardownSystemBackVetoCallback()
        parentContainerRegistry.detach(this)
        colorSchemeCoordinator.teardown()
        // `parent` is still set here. The containers above must stop consulting this subtree,
        // which has just been unregistered from its parent item.
        invalidateAncestorStackContainersSystemBackVetoState(this)
    }

    override fun onConfigurationChanged(newConfig: Configuration?) {
        super.onConfigurationChanged(newConfig)
        colorSchemeCoordinator.onConfigurationChanged(newConfig)
    }

    override fun onFragmentConfigurationChanged(config: Configuration) = onConfigurationChanged(config)

    internal fun setupFragmentManger() {
        val fmWithOwner = FragmentManagerHelper.findFragmentManagerWithOwnerForView(this)
        fragmentManager = fmWithOwner.fragmentManager.also { it.addOnBackStackChangedListener(this) }
        setupSystemBackVetoCallback(fmWithOwner)
    }

    /**
     * Call this function to trigger container update
     */
    internal fun performContainerUpdateIfNeeded() {
        // If container update is requested before container is attached to window, we ignore
        // the call because we don't have valid fragmentManager yet.
        // Update will be eventually executed in onAttachedToWindow().
        if (hasPendingOperations && isAttachedToWindow) {
            performOperations(requireFragmentManager())
        }
    }

    internal fun enqueuePushOperation(stackScreen: StackScreen) {
        pendingPushOperations.add(PushOperation(stackScreen))
    }

    internal fun enqueuePopOperation(stackScreen: StackScreen) {
        pendingPopOperations.add(PopOperation(stackScreen))
    }

    private fun performOperations(fragmentManager: FragmentManager) {
        applyOperationsAndComputeFragmentManagerOperations()
        invalidateSystemBackVetoState()
        fragmentOpExecutor.executeOperations(fragmentManager, fragmentOps, flushSync = false)

        dumpStackModel()
    }

    private fun applyOperationsAndComputeFragmentManagerOperations() {
        fragmentOps.clear()

        // Handle pop operations first.
        // We don't care about pop/push duplicates, as long as we don't let the main loop progress
        // before we commit all the transactions, FragmentManager will handle that for us.

        pendingPopOperations.forEach { operation ->
            val fragment =
                checkNotNull(stackModel.find { it.stackScreen === operation.screen }) {
                    "[RNScreens] Unable to find a fragment to pop"
                }

            check(stackModel.size > 1) {
                "[RNScreens] Attempt to pop last screen from the stack"
            }

            fragmentOps.add(PopBackStackOp(fragment))

            check(stackModel.removeAt(stackModel.lastIndex) === fragment) {
                "[RNScreens] Attempt to pop non-top screen"
            }
        }

        pendingPushOperations.forEach { operation ->
            val newFragment =
                createFragmentForScreen(operation.screen, canNavigateBack = stackModel.isNotEmpty())

            fragmentOps.add(
                AddAndSetAsPrimaryOp(
                    newFragment,
                    containerViewId = this.id,
                    addToBackStack = stackModel.isNotEmpty(),
                ),
            )
            stackModel.add(newFragment)
        }

        check(stackModel.isNotEmpty()) { "[RNScreens] Stack should never be empty after updates" }

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }

    private fun onNativeFragmentPop(fragment: StackScreenFragment) {
        require(stackModel.remove(fragment)) { "[RNScreens] onNativeFragmentPop must be called with the fragment present in stack model" }
        check(stackModel.isNotEmpty()) { "[RNScreens] Stack model should not be empty after a native pop" }

        // Runs mid-transaction (see onBackStackChangeCommitted). Flipping an OnBackPressedCallback's
        // enabled flag is safe here - FragmentManager does the same from within its own transactions.
        // Committing anything is not.
        invalidateSystemBackVetoState()
    }

    private fun dumpStackModel() {
        Log.d(TAG, "StackContainer [$id] MODEL BEGIN")
        stackModel.forEach {
            Log.d(TAG, "${it.stackScreen.screenKey}")
        }
    }

    private fun createFragmentForScreen(
        screen: StackScreen,
        canNavigateBack: Boolean,
    ): StackScreenFragment =
        StackScreenFragment(screen, canNavigateBack, WeakReference(this), backPressHandler = this).also {
            Log.d(TAG, "Created Fragment $it for screen ${screen.screenKey}")
        }

    /**
     * Computes top fragment from FragmentManager's state.
     * This one does not query the `stackModel`!
     *
     * Might return `null` if the stack is empty.
     */
    private fun determineTopFragment(): StackScreenFragment? =
        requireFragmentManager()
            .fragments
            .filterIsInstance<StackScreenFragment>()
            .lastOrNull()

    /**
     * If this.isLaidOut == false, then SpecialEffectsController won't perform animations / transitions.
     * This function tries to ensure that the container is laid out if it already has layout information.
     */
    private fun updateLaidOutFlagIfNeededAndPossible() {
        if (isAttachedToWindow && isMeasured() && !isLaidOut && !isInLayout) {
            containerParentOrNull()?.layoutContainerNow()
        }
    }

    // This is called after special effects (animations) are dispatched
    override fun onBackStackChanged() = Unit

    // This is called before the special effects (animations) are dispatched, however mid transaction!
    // Therefore make sure to not execute any action that might cause synchronous transaction synchronously
    // from this callback.
    override fun onBackStackChangeCommitted(
        fragment: Fragment,
        pop: Boolean,
    ) {
        if (fragment !is StackScreenFragment) {
            Log.w(TAG, "[RNScreens] Unexpected type of fragment: ${fragment.javaClass.simpleName}")
            return
        }

        // This callback is called for every fragment involved in the back stack change, even
        // if its not added or removed, but e.g. set as a primary navigation fragment, hence
        // we need to check whether the fragment is actually being removed.
        // I avoid using `pop` parameter here, because transaction might not be classified as `pop`
        // and still include fragment removal operations.
        if (fragment.isRemoving) {
            delegate.get()?.onScreenDismissCommitted(fragment.stackScreen)
            if (stackModel.contains(fragment)) {
                onNativeFragmentPop(fragment)
            }
        }
    }

    internal fun forceSubtreeMeasureAndLayoutPass() {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
        )

        layout(left, top, right, bottom)
    }

    // region Container

    override fun resolveCurrentContentScrollView(): ViewGroup? =
        determineTopFragment()
            ?.stackScreen
            ?.findContentScrollView()

    // Asked when this container's whole subtree is about to be dismissed (the screen
    // hosting this container is popped) - every item gets a vote, back-to-front, so
    // the deepest preventing screen wins.
    override fun wantsToPreventStackNativeDismiss(): ContainerItem? =
        stackModel
            .asReversed()
            .firstNotNullOfOrNull { it.stackScreen.wantsToPreventStackNativeDismiss() }

    // endregion

    // region Header back button

    override fun handleHeaderBackButtonPress(pressedScreen: StackScreen) {
        val fragmentManager = fragmentManager
        if (fragmentManager == null) {
            Log.w(TAG, "[RNScreens] Ignoring header back button press - container is detached")
            return
        }

        val topScreen = stackModel.lastOrNull()?.stackScreen
        if (topScreen !== pressedScreen || stackModel.size <= 1) {
            Log.w(
                TAG,
                "[RNScreens] Ignoring header back button press for non-top screen ${pressedScreen.screenKey}",
            )
            return
        }

        // This pop dismisses only the top screen (together with its subtree), therefore
        // only the top item is asked - screens below the top get no vote at this level.
        val vetoingItem = topScreen.wantsToPreventStackNativeDismiss()
        if (vetoingItem != null) {
            onNativeDismissPrevented(vetoingItem)
            return
        }

        // Mirrors FragmentManager's internal OnBackPressedCallback, which also runs
        // popBackStackImmediate. The synchronous pop makes the top-screen guard above
        // reliable against double taps: onBackStackChangeCommitted -> onNativeFragmentPop
        // updates stackModel before this call returns.
        fragmentManager.popBackStackImmediate(
            // key MUST BE present, otherwise the navigation action will be delegated to child primary navigation
            // fragment.
            checkNotNull(pressedScreen.screenKey) { "[RNScreens] Screen key is required" },
            FragmentManager.POP_BACK_STACK_INCLUSIVE,
        )
    }

    // endregion

    // region System back veto

    /**
     * Veto-only callback on the activity's OnBackPressedDispatcher. It never pops - FragmentManager
     * keeps doing that, which preserves its predictive back handling - it only blocks the pop when
     * the screen about to be dismissed (or anything in its subtree) has `preventNativeDismiss` enabled.
     *
     * Registered with the lifecycle owner of this container's FragmentManager, i.e. the very owner
     * FragmentManager uses for its own pop callback. Both callbacks are lifecycle-owned, so on every
     * stop/start cycle of the activity they are re-inserted into the dispatcher in a fixed order:
     * FragmentManager's first, ours right after it. Deeper containers register with deeper owners
     * (started later), so they land later still. The dispatcher runs the LAST enabled callback,
     * therefore a veto always beats the FragmentManager it shadows, and a deeper stack with
     * something to pop beats a shallower veto. Enabled state is recomputed eagerly, because predictive
     * back selects the callback when the gesture starts.
     *
     * Known limitation: a container re-attached while its owner is already started and its fragments
     * survive in the FragmentManager lands after its own nested FragmentManagers until the next
     * stop/start cycle (rare: Fabric remove+insert of an existing view, clipped subviews).
     */
    private var systemBackVetoCallback: SystemBackVetoCallback? = null

    private inner class SystemBackVetoCallback(
        private val dispatcher: OnBackPressedDispatcher,
    ) : OnBackPressedCallback(false) {
        override fun handleOnBackPressed() {
            val vetoingItem = findSystemBackVetoingItem()
            if (vetoingItem != null) {
                onNativeDismissPrevented(vetoingItem)
                return
            }
            // Enabled state went stale (e.g. the top screen was popped from JS while a predictive
            // gesture was in flight). Mirror FragmentManager's own fallback: step aside and hand the
            // press to the next enabled callback instead of swallowing it.
            Log.w(TAG, "[RNScreens] System back veto fired without a vetoing screen - re-dispatching")
            isEnabled = false
            dispatcher.onBackPressed()
            recomputeSystemBackVetoState()
        }
    }

    private fun setupSystemBackVetoCallback(fmWithOwner: FragmentManagerWithOwner) {
        check(systemBackVetoCallback == null) { "[RNScreens] System back veto callback is already registered" }
        systemBackVetoCallback =
            SystemBackVetoCallback(fmWithOwner.onBackPressedDispatcher).also {
                fmWithOwner.onBackPressedDispatcher.addCallback(fmWithOwner.lifecycleOwner, it)
            }
    }

    private fun teardownSystemBackVetoCallback() {
        systemBackVetoCallback?.remove()
        systemBackVetoCallback = null
    }

    // System back pops this container's top screen (together with its subtree), therefore only
    // the top item is asked - the same rule as for the header chevron.
    private fun findSystemBackVetoingItem(): ContainerItem? =
        stackModel.lastOrNull()?.stackScreen?.wantsToPreventStackNativeDismiss()

    /**
     * Recomputes this container's veto state. Call whenever the top item's answer to
     * `wantsToPreventStackNativeDismiss` might have changed. No-op while detached.
     */
    internal fun recomputeSystemBackVetoState() {
        systemBackVetoCallback?.isEnabled = findSystemBackVetoingItem() != null
    }

    // This container and every StackContainer above it - their answers depend on this subtree.
    private fun invalidateSystemBackVetoState() {
        recomputeSystemBackVetoState()
        invalidateAncestorStackContainersSystemBackVetoState(this)
    }

    private fun onNativeDismissPrevented(vetoingItem: ContainerItem) {
        // Only a StackScreen can veto - TabsScreen has no own flag and only forwards.
        val vetoingScreen = vetoingItem as? StackScreen
        if (vetoingScreen != null) {
            vetoingScreen.onNativeDismissPrevented()
        } else {
            Log.w(TAG, "[RNScreens] Unexpected vetoing item type: ${vetoingItem.javaClass.simpleName}")
        }
    }

    // endregion

    companion object {
        const val TAG = "StackContainer"
    }
}

/**
 * Recomputes the system back veto state of every [StackContainer] above [view] ([view] itself
 * excluded). Follows `parent` links, which are still intact inside `onDetachedFromWindow`.
 * The whole chain is walked, because a grand-ancestor's answer depends on the ancestor's.
 */
internal fun invalidateAncestorStackContainersSystemBackVetoState(view: View) {
    var parent: ViewParent? = view.parent
    while (parent != null) {
        if (parent is StackContainer) {
            parent.recomputeSystemBackVetoState()
        }
        parent = parent.parent
    }
}
