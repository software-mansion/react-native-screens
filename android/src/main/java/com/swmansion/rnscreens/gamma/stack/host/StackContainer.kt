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

interface StackContainerDelegate {

}

sealed class StackOperation

class AddOperation(val screen: StackScreen) : StackOperation()
class PopOperation() : StackOperation()


class StackContainer(context: Context) : CoordinatorLayout(context) {
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
        val fragmentManager = checkNotNull(fragmentManager) { "[RNScreens] Fragment manager was null during stack container update" }
        performOperations(fragmentManager, false)
    }

    fun addScreen(stackScreen: StackScreen) {
        pendingOperationQueue.add(AddOperation(stackScreen))
    }

    fun removeScreen(stackScreen: StackScreen) {
        pendingOperationQueue.add(PopOperation())
    }

    private fun performOperations(fragmentManager: FragmentManager, commitSync: Boolean = false) {
        val transaction = fragmentManager.createTransactionWithReordering()
        pendingOperationQueue.forEach { operation -> performOperation(transaction, operation) }
        pendingOperationQueue.clear()

        transaction.addToBackStack(null)

        if (commitSync) {
            transaction.commitNowAllowingStateLoss()
        } else {
            transaction.commitAllowingStateLoss()
        }

    }

    private fun performOperation(transaction: FragmentTransaction, operation: StackOperation) {
        when (operation) {
            is AddOperation -> performAddOperation(transaction, operation)
            is PopOperation -> performPopOperation(transaction, operation)
        }
    }

    private fun performAddOperation(transaction: FragmentTransaction, operation: AddOperation) {
        val associatedFragment = StackScreenFragment(operation.screen)
        stackScreenFragments.add(associatedFragment)
        transaction.add(this.id, associatedFragment)
    }

    private fun performPopOperation(transaction: FragmentTransaction, operation: PopOperation) {

    }

    companion object {
        const val TAG = "StackContainer"
    }
}