package com.swmansion.rnscreens.modals.formsheet.react.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.common.event.NamingAwareEventType

class FormSheetDidDisappearEvent(
    surfaceId: Int,
    viewId: Int,
) : Event<FormSheetDidDisappearEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName(): String = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun getEventData(): WritableMap? = Arguments.createMap()

    override fun canCoalesce(): Boolean = false

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topDidDisappear"
        const val EVENT_REGISTRATION_NAME = "onDidDisappear"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
