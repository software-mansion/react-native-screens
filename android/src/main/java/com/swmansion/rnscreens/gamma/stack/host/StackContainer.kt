package com.swmansion.rnscreens.gamma.stack.host

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
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

    init {
        id = ViewIdGenerator.generateViewId()
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackContainer [$id] attached to window")
        super.onAttachedToWindow()

        setupFragmentManger()

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
        val fragmentOps = applyOperationsAndComputeFragmentManagerOperations()
        fragmentOpExecutor.executeOperations(fragmentManager, fragmentOps, flushSync = false)

        dumpStackModel()
    }

    private fun applyOperationsAndComputeFragmentManagerOperations(): List<FragmentOperation> {
        val fragmentOps = mutableListOf<FragmentOperation>()

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
            val newFragment = createFragmentForScreen(operation.screen)
            fragmentOps.add(
                AddOp(
                    newFragment,
                    containerViewId = this.id,
                    addToBackStack = stackModel.isNotEmpty(),
                ),
            )
            stackModel.add(newFragment)
        }

        check(stackModel.isNotEmpty()) { "[RNScreens] Stack should never be empty after updates" }

        // Top fragment is the primary navigation fragment.
        fragmentOps.add(SetPrimaryNavFragmentOp(stackModel.last()))

        pendingPopOperations.clear()
        pendingPushOperations.clear()

        return fragmentOps
    }

    private fun onNativeFragmentPop(fragment: StackScreenFragment) {
        Log.d(TAG, "StackContainer [$id] natively removed fragment ${fragment.stackScreen.screenKey}")
        require(stackModel.remove(fragment)) { "[RNScreens] onNativeFragmentPop must be called with the fragment present in stack model" }
        check(stackModel.isNotEmpty()) { "[RNScreens] Stack model should not be empty after a native pop" }

        val fragmentManager = requireFragmentManager()
        if (fragmentManager.primaryNavigationFragment === fragment) {
            // We need to update the primary navigation fragment, otherwise the fragment manager
            // will have invalid state, pointing to the dismissed fragment.
            fragmentOpExecutor.executeOperations(
                fragmentManager,
                listOf(SetPrimaryNavFragmentOp(stackModel.last())),
            )
        }
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
        if (pop) {
            delegate.get()?.onScreenDismiss(fragment.stackScreen)
            if (stackModel.contains(fragment)) {
                onNativeFragmentPop(fragment)
            }
        }
    }

    companion object {
        const val TAG = "StackContainer"
    }
}
