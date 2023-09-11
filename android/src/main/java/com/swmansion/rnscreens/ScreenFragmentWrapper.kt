package com.swmansion.rnscreens

import android.app.Activity
import com.facebook.react.bridge.ReactContext

interface ScreenFragmentWrapper : FragmentHolder, ScreenEventDispatcher {
    var screen: Screen

    // Communication with container
    val childScreenContainers: List<ScreenContainer>
    fun addChildContainer(container: ScreenContainer)
    fun removeChildContainer(container: ScreenContainer)
    fun onContainerUpdate()

    // Animation phase callbacks
    fun onViewAnimationStart()
    fun onViewAnimationEnd()

    // Helpers
    fun tryGetActivity(): Activity?
    fun tryGetContext(): ReactContext?
}
