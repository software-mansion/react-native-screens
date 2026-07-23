package com.swmansion.rnscreens.tabs.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.common.event.BaseEventEmitter
import com.swmansion.rnscreens.tabs.container.TabsActionOrigin
import com.swmansion.rnscreens.tabs.container.TabsNavigationState
import com.swmansion.rnscreens.tabs.container.TabsNavigationStateRejectionReason
import com.swmansion.rnscreens.tabs.container.TabsNavigationStateUpdateRequest
import com.swmansion.rnscreens.tabs.host.event.TabsHostTabSelectedEvent
import com.swmansion.rnscreens.tabs.host.event.TabsHostTabSelectionPreventedEvent
import com.swmansion.rnscreens.tabs.host.event.TabsHostTabSelectionRejectedEvent

internal class TabsHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    /**
     * Emits `onTabSelected` event to JS with the current navigation state and selection context.
     */
    fun emitOnTabSelectedEvent(
        selectedScreenKey: String,
        provenance: Int,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        actionOrigin: TabsActionOrigin,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabSelectedEvent(
                surfaceId,
                viewTag,
                selectedScreenKey,
                provenance,
                isRepeated,
                hasTriggeredSpecialEffect,
                actionOrigin,
            ),
        )
    }

    /**
     * Emits `onTabSelectionRejected` event to JS when a navigation state update is rejected.
     * Carries both the active state and the rejected update so that JS can reconcile.
     */
    fun emitOnTabSelectionRejectedEvent(
        currentNavState: TabsNavigationState,
        rejectedRequest: TabsNavigationStateUpdateRequest,
        rejectionReason: TabsNavigationStateRejectionReason,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabSelectionRejectedEvent(
                surfaceId,
                viewTag,
                currentNavState,
                rejectedRequest,
                rejectionReason,
            ),
        )
    }

    /**
     * Emits `onTabSelectionPrevented` event to JS when a tab selection is prevented
     * because the target screen has `preventNativeSelection` enabled.
     */
    fun emitOnTabSelectionPreventedEvent(
        currentNavState: TabsNavigationState,
        preventedScreenKey: String,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabSelectionPreventedEvent(
                surfaceId,
                viewTag,
                currentNavState,
                preventedScreenKey,
            ),
        )
    }
}
