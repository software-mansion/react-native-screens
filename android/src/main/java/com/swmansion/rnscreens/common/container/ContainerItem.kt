package com.swmansion.rnscreens.common.container

import android.view.ViewGroup

interface ContainerItem {
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

    // region Native dismissal

    /**
     * Asked when this item (screen) is about to be natively dismissed together
     * with its subtree. The nested container (if any) is consulted first; its
     * non-null answer wins, otherwise the item answers for itself, returning
     * itself when it vetoes the dismissal or null otherwise.
     */
    fun wantsToPreventStackNativeDismiss(): ContainerItem?

    // endregion
}
