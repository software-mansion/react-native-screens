package com.swmansion.rnscreens.gamma.common.container

import android.view.ViewGroup

interface ContainerItem {
    // region Nested Container handling

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
