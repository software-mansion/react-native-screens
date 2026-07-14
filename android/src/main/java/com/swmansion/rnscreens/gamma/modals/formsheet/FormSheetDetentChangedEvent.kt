package com.swmansion.rnscreens.gamma.modals.formsheet

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

class FormSheetDetentChangedEvent(
    surfaceId: Int,
    viewId: Int,
    private val index: Int,
) : Event<FormSheetDetentChangedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName(): String = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun getEventData(): WritableMap =
        Arguments.createMap().apply {
            putInt("index", index)
        }

    override fun canCoalesce(): Boolean = false

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topDetentChanged"
        const val EVENT_REGISTRATION_NAME = "onDetentChanged"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
