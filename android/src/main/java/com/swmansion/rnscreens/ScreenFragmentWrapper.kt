package com.swmansion.rnscreens

import android.app.Activity
import com.facebook.react.bridge.ReactContext

interface ScreenFragmentWrapper : FragmentHolder {
    var screen: Screen
    val childScreenContainers: List<ScreenContainer<*>>

    // Communication with container
    fun onContainerUpdate()

    fun tryGetActivity(): Activity?
    fun tryGetContext(): ReactContext?
}
