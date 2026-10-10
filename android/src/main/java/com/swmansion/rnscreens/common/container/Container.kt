package com.swmansion.rnscreens.common.container

import android.view.ViewGroup

interface Container {
    /**
     * A container can have multiple items, and each item can have its own
     * content scroll view. It's down to implementer to decide, which scroll view to return here
     * (if any).
     */
    fun resolveCurrentContentScrollView(): ViewGroup?

    /**
     * Asked when this container's whole subtree is about to be natively dismissed,
     * e.g. the screen hosting this container is popped. Returns the item that
     * vetoes the dismissal via `preventNativeDismiss`, or null when nothing
     * in the subtree does.
     */
    fun wantsToPreventStackNativeDismiss(): ContainerItem?

    /**
     * Asks the container to pop its own stack to the root, if it can. If it has nothing
     * to pop (or can't pop), the request is forwarded to the nested container of its
     * active item.
     *
     * @return `true` if a pop was performed or requested (here or in a nested container), `false` otherwise.
     */
    fun requestPopToRoot(): Boolean
}
