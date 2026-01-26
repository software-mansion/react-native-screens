package com.swmansion.rnscreens.gamma.stack.host

import com.swmansion.rnscreens.gamma.stack.screen.StackScreen

internal class StackHostContainerUpdateScheduler {
    private val pendingPushOperations: MutableList<PushOperation> = arrayListOf()
    private val pendingPopOperations: MutableList<PopOperation> = arrayListOf()

    internal fun addPushOperation(stackScreen: StackScreen) {
        pendingPushOperations.add(PushOperation(stackScreen))
    }

    internal fun addPopOperation(stackScreen: StackScreen) {
        pendingPopOperations.add(PopOperation(stackScreen))
    }

    internal fun executePendingOperationsIfNeeded(container: StackContainer, renderedScreens: List<StackScreen>) {
        if (pendingPopOperations.isEmpty() && pendingPushOperations.isEmpty()) {
            return
        }

        // TODO: reordering
        pendingPopOperations.forEach { container.enqueuePopOperation(it.screen) }
        pendingPushOperations.forEach { container.enqueuePushOperation(it.screen) }

        container.performContainerUpdateIfNeeded()

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }
}
