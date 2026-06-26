package com.swmansion.rnscreens.gamma.common.container

import android.view.ViewGroup

internal fun findParentContainerItem(searchStartPoint: ViewGroup): ContainerItem? {
    var currView = searchStartPoint.parent

    while (currView != null) {
        if (currView is ContainerItem) {
            return currView
        }
        currView = currView.parent
    }
    return null
}

internal fun registerWithParentContainerItem(
    container: Container,
    searchStartPoint: ViewGroup,
): ContainerItem? =
    findParentContainerItem(searchStartPoint)?.let {
        it.registerNestedContainer(container)
        it
    }

internal fun unregisterFromParentContainerItem(
    parentContainerItem: ContainerItem?,
    childContainer: Container,
) {
    parentContainerItem?.unregisterNestedContainer(childContainer)
}
