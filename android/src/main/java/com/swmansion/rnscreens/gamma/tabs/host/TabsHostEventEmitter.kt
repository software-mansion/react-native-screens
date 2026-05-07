package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.container.TabsActionOrigin
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationState
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateRejectionReason
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateUpdateRequest
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostTabSelectedEvent
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostTabSelectionPreventedEvent
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostTabSelectionRejectedEvent

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
