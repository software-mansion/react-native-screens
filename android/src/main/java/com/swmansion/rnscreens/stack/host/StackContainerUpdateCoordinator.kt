package com.swmansion.rnscreens.stack.host

import com.swmansion.rnscreens.stack.screen.StackScreenItem

internal class StackContainerUpdateCoordinator {
    private val pendingPushOperations: MutableList<PushOperation> = arrayListOf()
    private val pendingPopOperations: MutableList<PopOperation> = arrayListOf()
    private val hasPendingOperations: Boolean
        get() = pendingPushOperations.isNotEmpty() || pendingPopOperations.isNotEmpty()

    internal fun addPushOperation(stackScreen: StackScreenItem) {
        pendingPushOperations.add(PushOperation(stackScreen))
    }

    internal fun addPopOperation(stackScreen: StackScreenItem) {
        pendingPopOperations.add(PopOperation(stackScreen))
    }

    /**
     * Hands the pending operations to the container in stack order. The container applies
     * them on its next update.
     */
    internal fun enqueuePendingOperations(
        container: StackContainer,
        renderedScreens: List<StackScreenItem>,
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

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }
}
