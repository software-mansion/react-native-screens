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
     * @param isNativeAction Whether the change was initiated by a native user action (tap).
     */
    fun onNavStateUpdate(
        navState: TabsNavState,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        isNativeAction: Boolean,
    )

    /**
     * Called when the container rejects a navigation state update.
     *
     * @param currentNavState The currently active navigation state that was kept.
     * @param rejectedNavState The navigation state update that was rejected.
     * @param reason Why the update was rejected.
     */
    fun onNavStateUpdateRejected(
        currentNavState: TabsNavState,
        rejectedNavState: TabsNavState,
        reason: TabsNavStateUpdateRejectionReason,
    )
}
