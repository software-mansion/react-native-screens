package com.swmansion.rnscreens.gamma.stack.host

import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.swmansion.rnscreens.gamma.helpers.createTransactionWithReordering

internal class FragmentOperationExecutor {
    internal fun executeOperations(
        fragmentManager: FragmentManager,
        ops: List<FragmentOperation>,
        flushSync: Boolean = false,
    ) {
        ops.forEach { it.execute(fragmentManager, this) }

        if (flushSync) {
            fragmentManager.executePendingTransactions()
        }
    }

    internal fun executeAddOp(
        fragmentManager: FragmentManager,
        op: AddOp,
    ) {
        fragmentManager.createTransactionWithReordering().let { tx ->
            tx.add(op.containerViewId, op.fragment)
            if (op.addToBackStack) {
                tx.addToBackStack(op.fragment.stackScreen.screenKey)
            }
            commitTransaction(tx, op.allowStateLoss)
        }
    }

    internal fun executePopBackStackOp(
        fragmentManager: FragmentManager,
        op: PopBackStackOp,
    ) {
        fragmentManager.popBackStack(
            op.fragment.stackScreen.screenKey,
            FragmentManager.POP_BACK_STACK_INCLUSIVE,
        )
    }

    internal fun executeRemoveOp(
        fragmentManager: FragmentManager,
        op: RemoveOp,
    ) {
        fragmentManager.createTransactionWithReordering().let { tx ->
            tx.remove(op.fragment)
            commitTransaction(tx, op.allowStateLoss, op.flushSync)
        }
    }

    internal fun executeFlushOp(
        fragmentManager: FragmentManager,
        op: FlushNowOp,
    ) {
        fragmentManager.executePendingTransactions()
    }

    internal fun executeSetPrimaryNavFragmentOp(
        fragmentManager: FragmentManager,
        op: SetPrimaryNavFragmentOp,
    ) {
        fragmentManager.createTransactionWithReordering().let { tx ->
            tx.setPrimaryNavigationFragment(op.fragment)
            commitTransaction(tx, allowStateLoss = true, flushSync = false)
        }
    }

    private fun commitTransaction(
        tx: FragmentTransaction,
        allowStateLoss: Boolean,
        flushSync: Boolean = false,
    ) {
        if (flushSync) {
            commitSync(tx, allowStateLoss)
        } else {
            commitAsync(tx, allowStateLoss)
        }
    }

    private fun commitAsync(
        tx: FragmentTransaction,
        allowStateLoss: Boolean,
    ) {
        if (allowStateLoss) {
            tx.commitAllowingStateLoss()
        } else {
            tx.commit()
        }
    }

    private fun commitSync(
        tx: FragmentTransaction,
        allowStateLoss: Boolean,
    ) {
        if (allowStateLoss) {
            tx.commitNowAllowingStateLoss()
        } else {
            tx.commitNow()
        }
    }
}
