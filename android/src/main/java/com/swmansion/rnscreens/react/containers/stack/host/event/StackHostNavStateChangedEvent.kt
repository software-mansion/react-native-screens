package com.swmansion.rnscreens.react.containers.stack.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.core.containers.stack.host.StackActionOrigin
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationState
import com.swmansion.rnscreens.react.common.event.NamingAwareEventType

/**
 * React Native event dispatched to JS on every transition of the stack's navigation state.
 *
 * This event is never coalesced — every transition is delivered individually.
 */
internal class StackHostNavStateChangedEvent(
    surfaceId: Int,
    viewId: Int,
    val navState: StackNavigationState,
    val actionOrigin: StackActionOrigin,
) : Event<StackHostNavStateChangedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putArray(EK_STACK, Arguments.fromList(navState.stack))
            putInt(EK_PROVENANCE, navState.provenance)
            putString(EK_ACTION_ORIGIN, actionOrigin.toString())
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topNavStateChanged"
        const val EVENT_REGISTRATION_NAME = "onNavStateChanged"

        private const val EK_STACK = "stack"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_ACTION_ORIGIN = "actionOrigin"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
