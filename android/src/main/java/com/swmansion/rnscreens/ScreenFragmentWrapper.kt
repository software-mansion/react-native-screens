package com.swmansion.rnscreens

import android.app.Activity
import com.facebook.react.bridge.ReactContext

interface ScreenFragmentWrapper :
    FragmentHolder,
    ScreenEventDispatcher {
    var screen: Screen

    // Communication with container
    val childScreenContainers: List<ScreenContainer>

    fun addChildScreenContainer(container: ScreenContainer)

    fun removeChildScreenContainer(container: ScreenContainer)

    /**
     * Container that this fragment belongs to calls it to notify the fragment,
     * that the container has updated.
     */
    fun onContainerUpdate()

    // Animation phase callbacks
    fun onViewAnimationStart()

    fun onViewAnimationEnd()

    // Helpers
    fun tryGetActivity(): Activity?

    fun tryGetContext(): ReactContext?
}
