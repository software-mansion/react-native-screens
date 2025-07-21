package com.swmansion.rnscreens.gamma.tabs.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.NamingAwareEventType

class TabsHostNativeFocusChangeEvent(
    surfaceId: Int,
    viewId: Int,
    val tabKey: String,
) : Event<TabScreenDidAppearEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    // All events for a given view can be coalesced.
    override fun getCoalescingKey(): Short = 0

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putString(EVENT_KEY_TAB_KEY, tabKey)
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topNativeFocusChange"
        const val EVENT_REGISTRATION_NAME = "onNativeFocusChange"

        private const val EVENT_KEY_TAB_KEY = "tabKey"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
