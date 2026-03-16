package com.swmansion.rnscreens.gamma.stack.host

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import com.swmansion.rnscreens.ext.isMeasured
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.gamma.helpers.ViewIdGenerator
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.gamma.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
internal class StackContainer(
    context: Context,
    private val delegate: WeakReference<StackContainerDelegate>,
) : CoordinatorLayout(context),
    FragmentManager.OnBackStackChangedListener {
    private var fragmentManager: FragmentManager? = null

    private fun requireFragmentManager(): FragmentManager =
        checkNotNull(fragmentManager) { "[RNScreens] Attempt to use nullish FragmentManager" }

    /**
     * Will crash in case parent does not implement StackContainerParent interface.
     */
    private fun containerParentOrNull(): StackContainerParent? = this.parent as StackContainerParent?

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

    init {
        id = ViewIdGenerator.generateViewId()
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackContainer [$id] attached to window")
        super.onAttachedToWindow()

        setupFragmentManger()

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
    }

    internal fun setupFragmentManger() {
        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }.also {
                it.addOnBackStackChangedListener(this)
            }
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
            fragmentOps.add(
                OnCommitCallbackOp(
                    { updateTopFragment() },
                    allowStateLoss = true,
                    flushSync = false,
                ),
            )
        }

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
            val newFragment = createFragmentForScreen(operation.screen)

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

        // The primary navigation fragment should be updated when popping backstack by FragmentManager
        // reversing the back stack record. At this point we need to just update the top fragment.
        check(requireFragmentManager().primaryNavigationFragment !== fragment) {
            "[RNScreens] Primary navigation fragment not updated by native pop"
        }
        updateTopFragment()
    }

    private fun dumpStackModel() {
        Log.d(TAG, "StackContainer [$id] MODEL BEGIN")
        stackModel.forEach {
            Log.d(TAG, "${it.stackScreen.screenKey}")
        }
    }

    private fun createFragmentForScreen(screen: StackScreen): StackScreenFragment =
        StackScreenFragment(screen).also {
            Log.d(TAG, "Created Fragment $it for screen ${screen.screenKey}")
        }

    private fun updateTopFragment() {
        // We try to handle situation where other fragments might be present.
        val fragmentManager = requireFragmentManager()
        val fragments = fragmentManager.fragments.filterIsInstance<StackScreenFragment>()
        check(fragments.isNotEmpty()) { "[RNScreens] Empty fragment manager while attempting to update top fragment" }
        fragments.forEach { it.onResignTopFragment() }
        fragments.last().onBecomeTopFragment()

        // This assumes that the updateTopFragment is called already after primary nav frag. is updated.
        // If this needs to be changed in the future, just remove this assertion.
        check(fragmentManager.primaryNavigationFragment === fragments.last()) {
            "[RNScreens] Top fragment different from primary navigation fragment"
        }
    }

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

    companion object {
        const val TAG = "StackContainer"
    }
}
