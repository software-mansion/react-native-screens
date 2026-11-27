package com.swmansion.rnscreens.react.containers.stack.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.react.common.event.NamingAwareEventType

/**
 * React Native event dispatched to JS when screens removed from the stack are no longer held by native.
 *
 * This event is never coalesced — every key is reported exactly once.
 */
internal class StackHostScreensReleasedEvent(
    surfaceId: Int,
    viewId: Int,
    val screenKeys: List<String>,
) : Event<StackHostScreensReleasedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putArray(EK_SCREEN_KEYS, Arguments.fromList(screenKeys))
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topScreensReleased"
        const val EVENT_REGISTRATION_NAME = "onScreensReleased"

        private const val EK_SCREEN_KEYS = "screenKeys"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
