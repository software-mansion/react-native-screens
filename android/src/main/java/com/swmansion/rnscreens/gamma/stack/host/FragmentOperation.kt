package com.swmansion.rnscreens.gamma.stack.host

import androidx.fragment.app.FragmentManager
import com.swmansion.rnscreens.gamma.stack.screen.StackScreenFragment

internal sealed class FragmentOperation {
    internal abstract fun execute(
        fragmentManager: FragmentManager,
        executor: FragmentOperationExecutor,
    )
}

internal class AddAndSetAsPrimaryOp(
    val fragment: StackScreenFragment,
    val containerViewId: Int,
    val addToBackStack: Boolean,
    val allowStateLoss: Boolean = true,
) : FragmentOperation() {
    override fun execute(
        fragmentManager: FragmentManager,
        executor: FragmentOperationExecutor,
    ) {
        executor.executeAddAndSetAsPrimaryOp(fragmentManager, this)
    }
}

internal class PopBackStackOp(
    val fragment: StackScreenFragment,
) : FragmentOperation() {
    override fun execute(
        fragmentManager: FragmentManager,
        executor: FragmentOperationExecutor,
    ) {
        executor.executePopBackStackOp(fragmentManager, this)
    }
}

internal class RemoveOp(
    val fragment: StackScreenFragment,
    val allowStateLoss: Boolean = true,
    val flushSync: Boolean = false,
) : FragmentOperation() {
    override fun execute(
        fragmentManager: FragmentManager,
        executor: FragmentOperationExecutor,
    ) {
        executor.executeRemoveOp(fragmentManager, this)
    }
}

internal class FlushNowOp : FragmentOperation() {
    override fun execute(
        fragmentManager: FragmentManager,
        executor: FragmentOperationExecutor,
    ) {
        executor.executeFlushOp(fragmentManager, this)
    }
}

internal class OnCommitCallbackOp(
    val onCommitCallback: Runnable,
    val allowStateLoss: Boolean = true,
    val flushSync: Boolean = false,
) : FragmentOperation() {
    override fun execute(
        fragmentManager: FragmentManager,
        executor: FragmentOperationExecutor,
    ) {
        executor.executeOnCommitCallbackOp(fragmentManager, this)
    }
}
