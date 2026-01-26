package com.swmansion.rnscreens.gamma.stack.host

import android.content.Context
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.swmansion.rnscreens.gamma.helpers.FragmentManagerHelper
import com.swmansion.rnscreens.gamma.helpers.ViewIdGenerator
import com.swmansion.rnscreens.gamma.helpers.createTransactionWithReordering
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.gamma.stack.screen.StackScreenFragment
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference

sealed class StackOperation

class AddOperation(
    val screen: StackScreen,
) : StackOperation()

class PopOperation(
    val screen: StackScreen,
) : StackOperation()

class StackContainer(
    context: Context,
    private val delegate: WeakReference<StackContainerDelegate>,
) : CoordinatorLayout(context) {
    private var fragmentManager: FragmentManager? = null

    private val stackScreenFragments: MutableList<StackScreenFragment> = arrayListOf()
    private val pendingOperationQueue: MutableList<StackOperation> = arrayListOf()

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
    }

    /**
     * Call this function to trigger container update
     */
    fun performContainerUpdateIfNeeded() {
        if (pendingOperationQueue.isNotEmpty()) {
            val fragmentManager =
                checkNotNull(fragmentManager) { "[RNScreens] Fragment manager was null during stack container update" }
            performOperations(fragmentManager, false)
        }
    }

    fun enqueueAddOperation(stackScreen: StackScreen) {
        pendingOperationQueue.add(AddOperation(stackScreen))
    }

    fun enqueuePopOperation(stackScreen: StackScreen) {
        pendingOperationQueue.add(PopOperation(stackScreen))
    }

    private fun performOperations(
        fragmentManager: FragmentManager,
        commitSync: Boolean = false,
    ) {
        val transaction = fragmentManager.createTransactionWithReordering()
        pendingOperationQueue.forEach { operation -> performOperation(fragmentManager, transaction, operation) }

        // TODO: refactor + should every push be added as separate back stack entry to maintain history?
        val lastPushScreenKey =
            pendingOperationQueue
                .reversed()
                .filter { it is AddOperation }
                .map { operation -> (operation as AddOperation).screen.screenKey }
                .firstOrNull()

        pendingOperationQueue.clear()

        // Pop operation does not use transaction
        if (!transaction.isEmpty) {
            require(lastPushScreenKey != null) { "[RNScreens] Expected non-null screenKey for back stack entry." }

            // don't add root to back stack to handle exiting from app.
            if (fragmentManager.fragments.isNotEmpty()) {
                transaction.addToBackStack(lastPushScreenKey)
            }

            if (commitSync) {
                // TODO: will not work with back stack
                transaction.commitNowAllowingStateLoss()
            } else {
                transaction.commitAllowingStateLoss()
            }
        }
    }

    private fun performOperation(
        fragmentManager: FragmentManager,
        transaction: FragmentTransaction,
        operation: StackOperation,
    ) {
        when (operation) {
            is AddOperation -> performAddOperation(transaction, operation)
            is PopOperation -> performPopOperation(fragmentManager, operation)
        }
    }

    private fun performAddOperation(
        transaction: FragmentTransaction,
        operation: AddOperation,
    ) {
        val associatedFragment = StackScreenFragment(WeakReference(this), operation.screen)
        stackScreenFragments.add(associatedFragment)
        transaction.add(this.id, associatedFragment)
    }

    private fun performPopOperation(
        fragmentManager: FragmentManager,
        operation: PopOperation,
    ) {
        val backStackEntryCount = fragmentManager.backStackEntryCount
        require(backStackEntryCount > 0) { "[RNScreens] Back stack must not be empty." }

        val lastBackStackEntry = fragmentManager.getBackStackEntryAt(backStackEntryCount - 1)
        require(lastBackStackEntry.name == operation.screen.screenKey) { "[RNScreens] Popping is supported only for top screen." }

        fragmentManager.popBackStack(lastBackStackEntry.name, FragmentManager.POP_BACK_STACK_INCLUSIVE)
    }

    internal fun onFragmentDestroyView(fragment: StackScreenFragment) {
        delegate.get()?.onNativeDismiss(fragment.stackScreen)
    }

    companion object {
        const val TAG = "StackContainer"
    }
}
