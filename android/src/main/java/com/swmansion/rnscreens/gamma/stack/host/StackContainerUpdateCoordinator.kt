package com.swmansion.rnscreens.gamma.stack.host

import com.swmansion.rnscreens.gamma.stack.screen.StackScreen

internal class StackContainerUpdateCoordinator {
    private val pendingPushOperations: MutableList<PushOperation> = arrayListOf()
    private val pendingPopOperations: MutableList<PopOperation> = arrayListOf()
    private val hasPendingOperations: Boolean
        get() = pendingPushOperations.isNotEmpty() || pendingPopOperations.isNotEmpty()

    internal fun addPushOperation(stackScreen: StackScreen) {
        pendingPushOperations.add(PushOperation(stackScreen))
    }

    internal fun addPopOperation(stackScreen: StackScreen) {
        pendingPopOperations.add(PopOperation(stackScreen))
    }

    internal fun executePendingOperationsIfNeeded(
        container: StackContainer,
        renderedScreens: List<StackScreen>,
    ) {
        if (!hasPendingOperations) {
            return
        }

        pendingPopOperations
            .map { Pair(renderedScreens.indexOf(it.screen), it) }
            .sortedBy { it.first }
            .asReversed()
            .forEach { (_, operation) -> container.enqueuePopOperation(operation.screen) }

        pendingPushOperations
            .map { Pair(renderedScreens.indexOf(it.screen), it) }
            .sortedBy { it.first }
            .forEach { (_, operation) -> container.enqueuePushOperation(operation.screen) }

        container.performContainerUpdateIfNeeded()

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }
}
