package com.swmansion.rnscreens.gamma.common.container

import android.view.ViewGroup

internal interface ContainerItem {
    // region Nested Container handling

    /**
     * A `ContainerItem` supports at most a single nested `Container`. Registering
     * a second container while one is already registered overwrites the previous
     * one. This is an intentional design invariant: a single item is expected to
     * host at most one nested container.
     */
    fun registerNestedContainer(container: Container)

    fun unregisterNestedContainer(container: Container)

    fun resolveNestedContainer(): Container?

    // endregion

    // region Content Scroll View support

    /**
     * @return Content scroll view associated with this container item.
     */
    fun findContentScrollView(): ViewGroup?

    // endregion
}
