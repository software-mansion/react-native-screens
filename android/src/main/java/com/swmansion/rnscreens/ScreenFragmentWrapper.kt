package com.swmansion.rnscreens

interface ScreenFragmentWrapper : FragmentHolder {
    var screen: Screen

    fun onContainerUpdate()
}
