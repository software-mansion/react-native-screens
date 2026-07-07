package com.swmansion.rnscreens.gamma.tabs.container

/**
 * Observer of navigation state changes on a [TabsContainer].
 *
 * Multiple observers may register against a single container via
 * [TabsContainer.addNavigationStateObserver] / [TabsContainer.removeNavigationStateObserver].
 * The host (`TabsHost` on Android) registers itself as an observer to relay events to JS;
 * downstream native libraries integrating directly against [TabsContainer] may register
 * additional observers.
 */
interface TabsNavigationStateObserver {
    /**
     * Called when the container accepts a navigation state change.
     *
     * @param navState The new navigation state after the change.
     * @param isRepeated Whether the same tab that was already selected has been selected again.
     * @param hasTriggeredSpecialEffect Whether a special effect (e.g. scroll-to-top) was triggered.
     * @param actionOrigin Origin (actor) that requested this transition.
     */
    fun onNavigationStateUpdate(
        navState: TabsNavigationState,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        actionOrigin: TabsActionOrigin,
    )

    /**
     * Called when the container rejects a navigation state update.
     *
     * @param currentNavState The currently active navigation state that was kept.
     * @param rejectedRequest The navigation state update request that was rejected.
     * @param reason Why the update was rejected.
     */
    fun onNavigationStateUpdateRejected(
        currentNavState: TabsNavigationState,
        rejectedRequest: TabsNavigationStateUpdateRequest,
        reason: TabsNavigationStateRejectionReason,
    )

    /**
     * Called when a native user action (tap) attempts to select a tab that has
     * [com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen.preventNativeSelection] enabled.
     * The navigation state remains unchanged.
     *
     * @param currentNavState The currently active navigation state that was kept.
     * @param preventedScreenKey The screen key of the tab whose selection was prevented.
     */
    fun onNavigationStateUpdatePrevented(
        currentNavState: TabsNavigationState,
        preventedScreenKey: String,
    )
}
