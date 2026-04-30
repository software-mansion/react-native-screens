package com.swmansion.rnscreens.gamma.tabs.container

/**
 * Callback interface for observing navigation state changes and rejections
 * in [TabsContainer]. Implemented by [com.swmansion.rnscreens.gamma.tabs.host.TabsHost] to relay events to JS.
 */
internal interface TabsContainerDelegate {
    /**
     * Called when the container accepts a navigation state change.
     *
     * @param navState The new navigation state after the change.
     * @param isRepeated Whether the same tab that was already selected has been selected again.
     * @param hasTriggeredSpecialEffect Whether a special effect (e.g. scroll-to-top) was triggered.
     * @param actionOrigin Origin (actor) that requested this transition.
     */
    fun onNavStateUpdate(
        navState: TabsNavState,
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
    fun onNavStateUpdateRejected(
        currentNavState: TabsNavState,
        rejectedRequest: TabsNavStateUpdateRequest,
        reason: TabsNavStateUpdateRejectionReason,
    )

    /**
     * Called when a native user action (tap) attempts to select a tab that has
     * [com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen.preventNativeSelection] enabled.
     * The navigation state remains unchanged.
     *
     * @param currentNavState The currently active navigation state that was kept.
     * @param preventedScreenKey The screen key of the tab whose selection was prevented.
     */
    fun onNavStateUpdatePrevented(
        currentNavState: TabsNavState,
        preventedScreenKey: String,
    )
}
