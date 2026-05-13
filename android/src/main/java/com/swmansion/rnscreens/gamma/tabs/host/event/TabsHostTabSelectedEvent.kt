package com.swmansion.rnscreens.gamma.tabs.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType
import com.swmansion.rnscreens.gamma.tabs.container.TabsActionOrigin

class TabsHostTabSelectedEvent(
    surfaceId: Int,
    viewId: Int,
    val selectedScreenKey: String,
    val provenance: Int,
    val isRepeated: Boolean,
    val hasTriggeredSpecialEffect: Boolean,
    val actionOrigin: TabsActionOrigin,
) : Event<TabsHostTabSelectedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    // This event should never be coalesced. It informs JS side of all navigation events that happen.
    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putString(EK_SELECTED_KEY, selectedScreenKey)
            putInt(EK_PROVENANCE, provenance)
            putBoolean(EK_IS_REPEATED, isRepeated)
            putBoolean(EK_HAS_TRIGGERED_SPECIAL_EFFECT, hasTriggeredSpecialEffect)
            putString(EK_ACTION_ORIGIN, actionOrigin.toString())
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topTabSelected"
        const val EVENT_REGISTRATION_NAME = "onTabSelected"

        private const val EK_SELECTED_KEY = "selectedScreenKey"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_IS_REPEATED = "isRepeated"
        private const val EK_HAS_TRIGGERED_SPECIAL_EFFECT = "hasTriggeredSpecialEffect"
        private const val EK_ACTION_ORIGIN = "actionOrigin"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
