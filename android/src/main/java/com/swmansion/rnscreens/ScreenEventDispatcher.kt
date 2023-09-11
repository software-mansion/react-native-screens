package com.swmansion.rnscreens

interface ScreenEventDispatcher {
    fun canDispatchLifecycleEvent(event: ScreenFragment.ScreenLifecycleEvent): Boolean

    /**
     * Dispatches given screen lifecycle event to JS using screen from given fragment `fragmentHolder`
     */
    fun dispatchLifecycleEvent(event: ScreenFragment.ScreenLifecycleEvent, fragmentHolder: FragmentHolder)

    fun dispatchHeaderBackButtonClicked()
    fun dispatchTransitionProgress()

    // Concrete dispatchers
}
