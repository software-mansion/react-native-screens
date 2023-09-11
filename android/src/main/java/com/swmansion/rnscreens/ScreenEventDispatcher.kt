package com.swmansion.rnscreens

interface ScreenEventDispatcher {
    fun canDispatchLifecycleEvent(event: ScreenFragment.ScreenLifecycleEvent): Boolean

    /**
     * Dispatches given screen lifecycle event to JS using screen from given fragment `fragmentWrapper`
     */
    fun dispatchLifecycleEvent(event: ScreenFragment.ScreenLifecycleEvent, fragmentWrapper: ScreenFragmentWrapper)

    fun dispatchHeaderBackButtonClickedEvent()
    fun dispatchTransitionProgressEvent(alpha: Float, closing: Boolean)

    // Concrete dispatchers
}
