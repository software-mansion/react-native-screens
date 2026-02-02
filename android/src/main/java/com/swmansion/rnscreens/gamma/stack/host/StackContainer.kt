package com.swmansion.rnscreens.gamma.stack.host

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.fragment.app.FragmentManager
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.gamma.helpers.ViewIdGenerator
import com.swmansion.rnscreens.gamma.helpers.createTransactionWithReordering
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.gamma.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
internal class StackContainer(
    context: Context,
    private val delegate: WeakReference<StackContainerDelegate>,
) : CoordinatorLayout(context) {
    private var fragmentManager: FragmentManager? = null

    /**
     * Describes most up-to-date view of the stack. It might be different from
     * state kept by FragmentManager as this data structure is updated immediately,
     * while operations on fragment manager are scheduled.
     *
     * FIXME: In case of native-pop, this might be out of date!
     */
    private val stackModel: MutableList<StackScreenFragment> = arrayListOf()

    private val pendingPopOperations: MutableList<PopOperation> = arrayListOf()
    private val pendingPushOperations: MutableList<PushOperation> = arrayListOf()
    private val hasPendingOperations: Boolean
        get() = pendingPushOperations.isNotEmpty() || pendingPopOperations.isNotEmpty()

    init {
        id = ViewIdGenerator.generateViewId()
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackContainer [$id] attached to window")
        super.onAttachedToWindow()

        fragmentManager =
            checkNotNull(FragmentManagerHelper.findFragmentManagerForView(this)) {
                "[RNScreens] Nullish fragment manager - can't run container operations"
            }

        // We run container update to handle any pending updates requested before container was
        // attached to window.
        performContainerUpdateIfNeeded()
    }

    /**
     * Call this function to trigger container update
     */
    internal fun performContainerUpdateIfNeeded() {
        // If container update is requested before container is attached to window, we ignore
        // the call because we don't have valid fragmentManager yet.
        // Update will be eventually executed in onAttachedToWindow().
        if (hasPendingOperations && isAttachedToWindow) {
            val fragmentManager =
                checkNotNull(fragmentManager) { "[RNScreens] Fragment manager was null during stack container update" }
            performOperations(fragmentManager)
        }
    }

    internal fun enqueuePushOperation(stackScreen: StackScreen) {
        pendingPushOperations.add(PushOperation(stackScreen))
    }

    internal fun enqueuePopOperation(stackScreen: StackScreen) {
        pendingPopOperations.add(PopOperation(stackScreen))
    }

    private fun performOperations(fragmentManager: FragmentManager) {
        // TODO: Handle case when we have pop & push of the same screen in single batch.

        pendingPopOperations.forEach { performPopOperation(fragmentManager, it) }
        pendingPushOperations.forEach { performPushOperation(fragmentManager, it) }

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }

    private fun performPushOperation(
        fragmentManager: FragmentManager,
        operation: PushOperation,
    ) {
        val transaction = fragmentManager.createTransactionWithReordering()

        val associatedFragment = StackScreenFragment(WeakReference(this), operation.screen)
        stackModel.add(associatedFragment)

        transaction.add(this.id, associatedFragment)

        // Don't add root screen to back stack to handle exiting from app.
        if (fragmentManager.fragments.isNotEmpty()) {
            transaction.addToBackStack(operation.screen.screenKey)
        }

        transaction.commitAllowingStateLoss()
    }

    private fun performPopOperation(
        fragmentManager: FragmentManager,
        operation: PopOperation,
    ) {
        val associatedFragment = stackModel.find { it.stackScreen === operation.screen }
        require(associatedFragment != null) {
            "[RNScreens] Unable to find a fragment to pop."
        }

        val backStackEntryCount = fragmentManager.backStackEntryCount
        if (backStackEntryCount > 0) {
            fragmentManager.popBackStack(
                operation.screen.screenKey,
                FragmentManager.POP_BACK_STACK_INCLUSIVE,
            )
        } else {
            // When fast refresh is used on root screen, we need to remove the screen manually.
            val transaction = fragmentManager.createTransactionWithReordering()
            transaction.remove(associatedFragment)
            transaction.commitNowAllowingStateLoss()
        }

        stackModel.remove(associatedFragment)
    }

    internal fun onFragmentDestroyView(fragment: StackScreenFragment) {
        if (stackModel.remove(fragment) && !fragment.stackScreen.isNativelyDismissed) {
            Log.e(TAG, "[RNScreens] StackContainer natively popped a screen that was not in model!")
        }
        delegate.get()?.onScreenDismiss(fragment.stackScreen)
    }

    companion object {
        const val TAG = "StackContainer"
    }
}
