package com.swmansion.rnscreens.gamma.common.container

import android.view.ViewGroup

/**
 * Shared state & logic backing a [Container]'s registration with the nearest
 * parent [ContainerItem] in the view hierarchy. Call [attach] when the container
 * attaches to the window and [detach] when it detaches.
 */
internal class ParentContainerItemRegistry {
    private var parentContainerItem: ContainerItem? = null

    fun <T> attach(self: T) where T : ViewGroup, T : Container {
        parentContainerItem = registerWithParentContainerItem(self, self)
    }

    fun detach(self: Container) {
        unregisterFromParentContainerItem(parentContainerItem, self)
        parentContainerItem = null
    }
}
