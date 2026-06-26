package com.swmansion.rnscreens.gamma.stack.header.toolbar.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackHeaderToolbarMenuItemPressEvent(
    surfaceId: Int,
    viewTag: Int,
    private val id: String,
) : Event<StackHeaderToolbarMenuItemPressEvent>(surfaceId, viewTag),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData() = Arguments.createMap().apply { putString(EK_ID, id) }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topToolbarMenuItemPress"
        const val EVENT_REGISTRATION_NAME = "onToolbarMenuItemPress"

        private const val EK_ID = "id"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
