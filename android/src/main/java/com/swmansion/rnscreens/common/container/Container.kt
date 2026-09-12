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
     * Called by the fragment that owns this container's FragmentManager when its primary
     * navigation status changed, i.e. the container may have moved on or off the active
     * navigation branch. Comes from `Fragment.onPrimaryNavigationFragmentChanged`, which
     * FragmentManager delivers only to the fragment whose status actually changed and then
     * continues into that fragment's child FragmentManager on its own.
     */
    fun onOwnerPrimaryNavigationFragmentChanged()
}
