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

    // Fragment information

    /**
     * Whether this screen fragment makes it possible to see content underneath it
     * (not fully opaque or does not fill full screen).
     */
    fun isTranslucent(): Boolean

    // Helpers
    fun tryGetActivity(): Activity?

    fun tryGetContext(): ReactContext?
}
