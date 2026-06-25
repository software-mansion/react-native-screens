package com.swmansion.rnscreens.gamma.common.container

import android.view.ViewGroup

interface Container {
    /**
     * A container can have multiple items, and each item can have its own
     * content scroll view. It's down to implementer to decide, which scroll view to return here
     * (if any).
     */
    fun resolveCurrentContentScrollView(): ViewGroup?
}
