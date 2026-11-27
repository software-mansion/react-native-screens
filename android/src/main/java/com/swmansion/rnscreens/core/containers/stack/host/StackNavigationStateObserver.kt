package com.swmansion.rnscreens.core.containers.stack.host

/**
 * Observer of navigation state changes on a [StackContainer].
 *
 * Multiple observers may register against a single container via
 * [StackContainer.addNavigationStateObserver] / [StackContainer.removeNavigationStateObserver].
 * The host (`StackHost` on Android) registers itself as an observer to relay events to JS;
 * downstream native libraries integrating directly against [StackContainer] may register
 * additional observers.
 */
interface StackNavigationStateObserver {
    /**
     * Called on every transition of the container's navigation state, whatever its origin, including the first
     * state of the container.
     *
     * @param navState The navigation state after the transition.
     * @param actionOrigin Origin (actor) of the transition.
     */
    fun onNavigationStateUpdate(
        navState: StackNavigationState,
        actionOrigin: StackActionOrigin,
    )

    /**
     * Called when the container rejects a navigation state request.
     *
     * @param currentNavState The current navigation state, which was kept.
     * @param rejectedRequest The request that was rejected.
     * @param reason Why the request was rejected.
     */
    fun onNavigationStateUpdateRejected(
        currentNavState: StackNavigationState,
        rejectedRequest: StackNavigationStateRequest,
        reason: StackNavigationStateRejectionReason,
    )

    /**
     * Called when screens removed from the stack are no longer held by the container, i.e. their exit
     * transition finished, or right after the transition that removed them if they had none.
     * Every key removed from the stack is reported exactly once.
     *
     * @param screenKeys Keys of the released screens.
     */
    fun onScreensReleased(screenKeys: List<String>)

    /**
     * Called when a native dismissal (a user action) was prevented because screens it would remove have
     * `preventNativeDismiss` enabled. The navigation state remains unchanged.
     *
     * @param currentNavState The current navigation state, which was kept.
     * @param preventedScreenKeys Keys of the screens that prevented the dismissal.
     */
    fun onNativeDismissPrevented(
        currentNavState: StackNavigationState,
        preventedScreenKeys: List<String>,
    )
}
