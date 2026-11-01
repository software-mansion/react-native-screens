package com.swmansion.rnscreens.react.containers.stack.host

import com.swmansion.rnscreens.core.containers.stack.host.PopOperation
import com.swmansion.rnscreens.core.containers.stack.host.PushOperation
import com.swmansion.rnscreens.core.containers.stack.host.StackContainer
import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem

internal class StackContainerUpdateCoordinator {
    private val pendingPushOperations: MutableList<PushOperation> = arrayListOf()
    private val pendingPopOperations: MutableList<PopOperation> = arrayListOf()
    private val hasPendingOperations: Boolean
        get() = pendingPushOperations.isNotEmpty() || pendingPopOperations.isNotEmpty()

    internal fun addPushOperation(item: StackContainerItem) {
        pendingPushOperations.add(PushOperation(item))
    }

    internal fun addPopOperation(item: StackContainerItem) {
        pendingPopOperations.add(PopOperation(item))
    }

    /**
     * Hands the pending operations to the container in stack order. The container applies
     * them on its next update.
     */
    internal fun enqueuePendingOperations(
        container: StackContainer,
        renderedItems: List<StackContainerItem>,
    ) {
        if (!hasPendingOperations) {
            return
        }

        pendingPopOperations
            .map { Pair(renderedItems.indexOf(it.item), it) }
            .sortedBy { it.first }
            .asReversed()
            .forEach { (_, operation) -> container.enqueuePopOperation(operation.item) }

        pendingPushOperations
            .map { Pair(renderedItems.indexOf(it.item), it) }
            .sortedBy { it.first }
            .forEach { (_, operation) -> container.enqueuePushOperation(operation.item) }

        pendingPopOperations.clear()
        pendingPushOperations.clear()
    }
}
