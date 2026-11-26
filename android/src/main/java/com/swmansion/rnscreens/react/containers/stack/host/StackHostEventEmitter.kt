package com.swmansion.rnscreens.react.containers.stack.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.core.containers.stack.host.StackActionOrigin
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationState
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRejectionReason
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRequest
import com.swmansion.rnscreens.react.common.event.BaseEventEmitter
import com.swmansion.rnscreens.react.containers.stack.host.event.StackHostNativeDismissPreventedEvent
import com.swmansion.rnscreens.react.containers.stack.host.event.StackHostNavStateChangedEvent
import com.swmansion.rnscreens.react.containers.stack.host.event.StackHostNavStateRequestRejectedEvent
import com.swmansion.rnscreens.react.containers.stack.host.event.StackHostScreensReleasedEvent

internal class StackHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    /**
     * Emits `onNavStateChanged` to JS with the navigation state after a transition and its origin.
     */
    fun emitOnNavStateChanged(
        navState: StackNavigationState,
        actionOrigin: StackActionOrigin,
    ) {
        reactEventDispatcher.dispatchEvent(
            StackHostNavStateChangedEvent(surfaceId, viewTag, navState, actionOrigin),
        )
    }

    /**
     * Emits `onNavStateRequestRejected` to JS. Carries both the current state and the rejected request, so that
     * JS can reconcile.
     */
    fun emitOnNavStateRequestRejected(
        currentNavState: StackNavigationState,
        rejectedRequest: StackNavigationStateRequest,
        rejectionReason: StackNavigationStateRejectionReason,
    ) {
        reactEventDispatcher.dispatchEvent(
            StackHostNavStateRequestRejectedEvent(surfaceId, viewTag, currentNavState, rejectedRequest, rejectionReason),
        )
    }

    /**
     * Emits `onScreensReleased` to JS with the keys of the screens native no longer holds.
     */
    fun emitOnScreensReleased(screenKeys: List<String>) {
        reactEventDispatcher.dispatchEvent(
            StackHostScreensReleasedEvent(surfaceId, viewTag, screenKeys),
        )
    }

    /**
     * Emits `onNativeDismissPrevented` to JS with the current state and the keys of the screens that prevented
     * the dismissal.
     */
    fun emitOnNativeDismissPrevented(
        currentNavState: StackNavigationState,
        preventedScreenKeys: List<String>,
    ) {
        reactEventDispatcher.dispatchEvent(
            StackHostNativeDismissPreventedEvent(surfaceId, viewTag, currentNavState, preventedScreenKeys),
        )
    }
}
