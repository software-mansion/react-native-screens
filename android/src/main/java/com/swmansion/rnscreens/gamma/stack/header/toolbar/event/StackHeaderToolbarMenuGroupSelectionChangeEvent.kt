package com.swmansion.rnscreens.gamma.stack.header.toolbar.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackHeaderToolbarMenuGroupSelectionChangeEvent(
    surfaceId: Int,
    viewTag: Int,
    private val groupId: String,
    private val selectedIds: List<String>,
) : Event<StackHeaderToolbarMenuGroupSelectionChangeEvent>(surfaceId, viewTag),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData() =
        Arguments.createMap().apply {
            putString(EK_GROUP_ID, groupId)
            putArray(
                EK_SELECTED_IDS,
                Arguments.createArray().apply {
                    selectedIds.forEach { pushString(it) }
                },
            )
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topToolbarMenuGroupSelectionChange"
        const val EVENT_REGISTRATION_NAME = "onToolbarMenuGroupSelectionChange"

        private const val EK_GROUP_ID = "groupId"
        private const val EK_SELECTED_IDS = "selectedIds"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
