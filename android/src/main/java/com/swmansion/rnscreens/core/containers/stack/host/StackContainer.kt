package com.swmansion.rnscreens.core.containers.stack.host

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.transition.Transition
import androidx.transition.Visibility
import com.swmansion.rnscreens.core.common.colorscheme.ColorScheme
import com.swmansion.rnscreens.core.common.colorscheme.ColorSchemeCoordinator
import com.swmansion.rnscreens.core.common.colorscheme.ColorSchemeListener
import com.swmansion.rnscreens.core.common.colorscheme.ColorSchemeProviding
import com.swmansion.rnscreens.core.containers.common.Container
import com.swmansion.rnscreens.core.containers.common.ContainerItem
import com.swmansion.rnscreens.core.containers.common.ParentContainerItemRegistry
import com.swmansion.rnscreens.core.containers.stack.animation.ScreenTransitionProviding
import com.swmansion.rnscreens.core.containers.stack.animation.StackTransitionContext
import com.swmansion.rnscreens.core.containers.stack.animation.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.animation.StackTransitionResolver
import com.swmansion.rnscreens.core.containers.stack.animation.engine.TransitionSlot
import com.swmansion.rnscreens.core.containers.stack.header.StackHeaderBackPressHandler
import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.core.containers.stack.screen.StackScreenFragmentDelegate
import com.swmansion.rnscreens.core.utils.RNSLog
import com.swmansion.rnscreens.core.utils.ViewIdProviding
import com.swmansion.rnscreens.core.utils.isMeasured
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
internal class StackContainer(
    context: Context,
    private val delegate: WeakReference<StackContainerDelegate>,
    viewIdProvider: ViewIdProviding,
) : FrameLayout(context),
    Container,
    FragmentManager.OnBackStackChangedListener,
    ColorSchemeProviding,
    StackHeaderBackPressHandler,
    StackScreenFragmentDelegate,
    StackUpdateBatchStateProviding,
    ScreenTransitionProviding {
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

    /**
     * Permanent child 0. Screens exiting under an entering screen are hosted in its overlay,
     * so they draw before every fragment view FragmentManager appends after it.
     */
    internal val underlay: FrameLayout = FrameLayout(context)

    override fun onViewAdded(child: View) {
        super.onViewAdded(child)
        check(getChildAt(0) === underlay) { "[RNScreens] underlay must stay at index 0" }
    }

    // region Color Scheme

    private val colorSchemeCoordinator = ColorSchemeCoordinator()

    internal var colorScheme: ColorScheme by colorSchemeCoordinator::colorScheme

    override fun getResolvedUiNightMode() = colorSchemeCoordinator.getResolvedUiNightMode()

    override fun addColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.addColorSchemeListener(listener)

    override fun removeColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.removeColorSchemeListener(listener)

    // endregion

    init {
        id = viewIdProvider.generateViewId()
        addView(underlay, 0, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackContainer [$id] attached to window")
        super.onAttachedToWindow()

        parentContainerRegistry.attach(this)
        setupFragmentManager()

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
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        requireFragmentManager().removeOnBackStackChangedListener(this)
        fragmentManager = null
        parentContainerRegistry.detach(this)
        colorSchemeCoordinator.teardown()
    }

    override fun onConfigurationChanged(newConfig: Configuration?) {
        super.onConfigurationChanged(newConfig)
        colorSchemeCoordinator.onConfigurationChanged(newConfig)
    }

    override fun onFragmentConfigurationChanged(config: Configuration) = onConfigurationChanged(config)

    internal fun setupFragmentManager() {
        fragmentManager =
            checkNotNull(delegate.get()) {
                "[RNScreens] StackContainer has no delegate to resolve the fragment manager from"
            }.resolveFragmentManager().also {
                it.addOnBackStackChangedListener(this)
            }
    }

    // region Update batch

    override var isUpdatePending: Boolean = false
        private set

    /**
     * Announces that more updates are coming. Header updates raised until [endUpdateBatch]
     * are held and applied together with the navigation operations of the batch.
     */
    internal fun beginUpdateBatch() {
        isUpdatePending = true
    }

    internal fun endUpdateBatch() {
        isUpdatePending = false
        performContainerUpdateIfNeeded()
    }

    // endregion

    /**
     * Applies pending navigation operations and then pending header updates of the screens
     * remaining in the stack.
     */
    internal fun performContainerUpdateIfNeeded() {
        // If container update is requested before container is attached to window, we ignore
        // the call because we don't have valid fragmentManager yet.
        // Update will be eventually executed in onAttachedToWindow().
        if (!isAttachedToWindow) {
            return
        }
        if (hasPendingOperations) {
            performOperations(requireFragmentManager())
        }
        stackModel.forEach { it.flushPendingHeaderUpdates() }
    }

    internal fun enqueuePushOperation(item: StackContainerItem) {
        pendingPushOperations.add(PushOperation(item))
    }

    internal fun enqueuePopOperation(item: StackContainerItem) {
        pendingPopOperations.add(PopOperation(item))
    }

    private fun performOperations(fragmentManager: FragmentManager) {
        Log.d(TRANSITION_TAG, "performOperations: ${pendingPopOperations.size} pops, ${pendingPushOperations.size} pushes, note=${transitionContext.describe()}")
        applyOperationsAndComputeFragmentManagerOperations()
        fragmentOpExecutor.executeOperations(fragmentManager, fragmentOps, flushSync = false)

        dumpStackModel()
    }

    private fun applyOperationsAndComputeFragmentManagerOperations() {
        fragmentOps.clear()

        // Handle pop operations first.
        // We don't care about pop/push duplicates, as long as we don't let the main loop progress
        // before we commit all the transactions, FragmentManager will handle that for us.

        if (hasPendingOperations) {
            // Top fragment is the primary navigation fragment. If we're going to change anything
            // in stack model, then we also should update top fragment.
            //
            // This is added before other operations, to make sure that they are correctly classified
            // as pop/non-pop by fragment manager.
            // This relies on Fragment Manager internal behavior obviously. It classifies
            // whole batch of transactions as "pop" (argument later passed to `onBackStackChange` commited)
            // when last operation of the batch is "pop". Empty commit with only onCommit callback
            // attached is not a "pop" commit, therefore JS-pop commits have not been properly
            // recognized.
            // The commit runnables run after FragmentManager has read the transitions of this
            // batch, which is the right moment to retire the note.
            fragmentOps.add(
                OnCommitCallbackOp(
                    {
                        updateTopFragment()
                        clearTransitionContext("commit runnable")
                    },
                    allowStateLoss = true,
                    flushSync = false,
                ),
            )
        }

        val previousTop = stackModel.lastOrNull()
        val modelBeforeBatch = stackModel.toList()

        pendingPopOperations.forEach { operation ->
            val fragment =
                checkNotNull(stackModel.find { it.item === operation.item }) {
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
                createFragmentForItem(operation.item, canNavigateBack = stackModel.isNotEmpty())

            fragmentOps.add(
                AddAndSetAsPrimaryOp(
                    newFragment,
                    containerViewId = this.id,
                    addToBackStack = stackModel.isNotEmpty(),
                    coveredFragment = stackModel.lastOrNull(),
                ),
            )
            stackModel.add(newFragment)
        }

        check(stackModel.isNotEmpty()) { "[RNScreens] Stack should never be empty after updates" }

        if (hasPendingOperations) {
            writeTransitionContext(previousTop, modelBeforeBatch)
        }

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }

    // region Transition provision

    /**
     * The note about the batch most recently committed, consulted by [transitionFor] while
     * FragmentManager executes it. Written when a batch is computed and on a native pop; cleared
     * once the reads are over (the batch's commit runnable, `onBackStackChanged`).
     */
    private var transitionContext: StackTransitionContext? = null

    /**
     * A JS batch computed while an earlier one is still pending in FragmentManager executes
     * together with it, so the outgoing screen stays the one FragmentManager still shows.
     */
    private fun writeTransitionContext(
        previousTop: StackScreenFragment?,
        modelBeforeBatch: List<StackScreenFragment>,
    ) {
        val incoming = stackModel.last()
        val outgoing = transitionContext?.outgoing ?: previousTop
        val kind =
            when {
                // The first screen is not a back stack record; nothing animates.
                outgoing == null -> null
                // The top did not change, e.g. a screen pushed and popped before execution.
                outgoing === incoming -> null
                stackModel.contains(outgoing) -> StackTransitionKind.PUSH
                modelBeforeBatch.contains(incoming) -> StackTransitionKind.POP
                else -> StackTransitionKind.REPLACE
            }
        transitionContext = kind?.let { StackTransitionContext(it, checkNotNull(outgoing), incoming) }
        Log.d(TRANSITION_TAG, "note written (batch): ${transitionContext.describe()}")
    }

    private fun clearTransitionContext(reason: String) {
        if (transitionContext != null) {
            Log.d(TRANSITION_TAG, "note cleared ($reason): ${transitionContext.describe()}")
        }
        transitionContext = null
    }

    override fun transitionFor(
        fragment: StackScreenFragment,
        slot: TransitionSlot,
    ): Transition? =
        StackTransitionResolver.resolve(fragment, slot, transitionContext, ::fragmentAbove).also {
            Log.d(
                TRANSITION_TAG,
                "read ${fragment.item.itemKey}.$slot note=${transitionContext.describe()} -> " +
                    (it?.let { t -> "${t.mode.modeName()} ${t.spec.durationMs}ms ${t.spec.tracks.size} tracks z=${t.zPolicy}" } ?: "null"),
            )
        }

    private fun fragmentAbove(fragment: StackScreenFragment): StackScreenFragment? {
        val index = stackModel.indexOf(fragment)
        return if (index >= 0) stackModel.getOrNull(index + 1) else null
    }

    private fun StackTransitionContext?.describe(): String =
        this?.let { "${it.kind}(${it.outgoing.item.itemKey} -> ${it.incoming.item.itemKey})" } ?: "none"

    private fun Int.modeName(): String = if (this == Visibility.MODE_IN) "IN" else "OUT"

    // endregion

    private fun onNativeFragmentPop(fragment: StackScreenFragment) {
        require(stackModel.remove(fragment)) { "[RNScreens] onNativeFragmentPop must be called with the fragment present in stack model" }
        check(stackModel.isNotEmpty()) { "[RNScreens] Stack model should not be empty after a native pop" }

        // The primary navigation fragment should be updated when popping backstack by FragmentManager
        // reversing the back stack record. At this point we need to just update the top fragment.
        check(requireFragmentManager().primaryNavigationFragment !== fragment) {
            "[RNScreens] Primary navigation fragment not updated by native pop"
        }
        updateTopFragment()

        // FragmentManager reads the transitions of this pop right after this callback (header
        // back, system back) or not at all (predictive back commit), always within the current
        // call stack. `onBackStackChanged` clears the note on the first path; the post covers
        // the second, where the note would otherwise outlive the popped fragment.
        val note = StackTransitionContext(StackTransitionKind.POP, outgoing = fragment, incoming = stackModel.last())
        transitionContext = note
        Log.d(TRANSITION_TAG, "note written (native pop): ${note.describe()}")
        post {
            if (transitionContext === note) {
                clearTransitionContext("post after native pop")
            }
        }
    }

    private fun dumpStackModel() {
        RNSLog.d(TAG, "StackContainer [$id] MODEL BEGIN")
        stackModel.forEach {
            RNSLog.d(TAG, "${it.item.itemKey}")
        }
    }

    private fun createFragmentForItem(
        item: StackContainerItem,
        canNavigateBack: Boolean,
    ): StackScreenFragment =
        StackScreenFragment(
            item,
            canNavigateBack,
            WeakReference(this),
            backPressHandler = WeakReference(this),
            updateBatchStateProvider = WeakReference(this),
            colorSchemeProvider = WeakReference(this),
            transitionProvider = WeakReference(this),
        ).also {
            RNSLog.d(TAG, "Created Fragment $it for item ${item.itemKey}")
        }

    private fun updateTopFragment() {
        // Covered fragments are detached, so FragmentManager's added list holds only the top
        // fragment - the model is the only place all of them can be resigned from.
        check(stackModel.isNotEmpty()) { "[RNScreens] Empty stack model while attempting to update top fragment" }
        stackModel.forEach { it.onResignTopFragment() }
        stackModel.last().onBecomeTopFragment()

        // This assumes that the updateTopFragment is called already after primary nav frag. is updated.
        // If this needs to be changed in the future, just remove this assertion.
        check(requireFragmentManager().primaryNavigationFragment === stackModel.last()) {
            "[RNScreens] Top fragment different from primary navigation fragment"
        }
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
    override fun onBackStackChanged() {
        clearTransitionContext("onBackStackChanged")
    }

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
            delegate.get()?.onItemDismissCommitted(fragment.item)
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
            ?.item
            ?.findContentScrollView()

    // Asked when this container's whole subtree is about to be dismissed (the screen
    // hosting this container is popped) - every item gets a vote, back-to-front, so
    // the deepest preventing screen wins.
    override fun wantsToPreventStackNativeDismiss(): ContainerItem? =
        stackModel
            .asReversed()
            .firstNotNullOfOrNull { it.item.wantsToPreventStackNativeDismiss() }

    // Pop-to-root is not implemented for the v5 stack yet - the request is forwarded to the top screen's
    // nested container.
    override fun requestPopToRoot(): Boolean {
        RNSLog.w(TAG, "[RNScreens] Pop-to-root special effect is not implemented for v5 stack yet")
        return stackModel
            .lastOrNull()
            ?.item
            ?.resolveNestedContainer()
            ?.requestPopToRoot() == true
    }

    // endregion

    // region Header back button

    override fun handleHeaderBackButtonPress(pressedItem: StackContainerItem) {
        val fragmentManager = fragmentManager
        if (fragmentManager == null) {
            Log.w(TAG, "[RNScreens] Ignoring header back button press - container is detached")
            return
        }

        val topItem = stackModel.lastOrNull()?.item
        if (topItem !== pressedItem || stackModel.size <= 1) {
            Log.w(
                TAG,
                "[RNScreens] Ignoring header back button press for non-top screen ${pressedItem.itemKey}",
            )
            return
        }

        // This pop dismisses only the top screen (together with its subtree), therefore
        // only the top item is asked - screens below the top get no vote at this level.
        val vetoingItem = topItem.wantsToPreventStackNativeDismiss()
        if (vetoingItem != null) {
            // Only a StackScreen can veto - TabsScreen has no own flag and only forwards.
            val vetoingStackItem = vetoingItem as? StackContainerItem
            if (vetoingStackItem != null) {
                vetoingStackItem.onNativeDismissPrevented()
            } else {
                Log.w(
                    TAG,
                    "[RNScreens] Unexpected vetoing item type: ${vetoingItem.javaClass.simpleName}",
                )
            }
            return
        }

        // Mirrors FragmentManager's internal OnBackPressedCallback, which also runs
        // popBackStackImmediate. The synchronous pop makes the top-screen guard above
        // reliable against double taps: onBackStackChangeCommitted -> onNativeFragmentPop
        // updates stackModel before this call returns.
        fragmentManager.popBackStackImmediate(
            // key MUST BE present, otherwise the navigation action will be delegated to child primary navigation
            // fragment.
            checkNotNull(pressedItem.itemKey) { "[RNScreens] Screen key is required" },
            FragmentManager.POP_BACK_STACK_INCLUSIVE,
        )
    }

    // endregion

    companion object {
        const val TAG = "StackContainer"
        private const val TRANSITION_TAG = "RNSTransition"
    }
}
