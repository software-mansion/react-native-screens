package com.swmansion.rnscreens.react.containers.stack.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationState
import com.swmansion.rnscreens.react.common.event.NamingAwareEventType

/**
 * React Native event dispatched to JS when a native dismissal was prevented by screens with
 * `preventNativeDismiss` enabled.
 *
 * This event is never coalesced — every prevention is delivered individually.
 */
internal class StackHostNativeDismissPreventedEvent(
    surfaceId: Int,
    viewId: Int,
    val currentNavState: StackNavigationState,
    val preventedScreenKeys: List<String>,
) : Event<StackHostNativeDismissPreventedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putArray(EK_STACK, Arguments.fromList(currentNavState.stack))
            putInt(EK_PROVENANCE, currentNavState.provenance)
            putArray(EK_PREVENTED_SCREEN_KEYS, Arguments.fromList(preventedScreenKeys))
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topNativeDismissPrevented"
        const val EVENT_REGISTRATION_NAME = "onNativeDismissPrevented"

        private const val EK_STACK = "stack"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_PREVENTED_SCREEN_KEYS = "preventedScreenKeys"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
