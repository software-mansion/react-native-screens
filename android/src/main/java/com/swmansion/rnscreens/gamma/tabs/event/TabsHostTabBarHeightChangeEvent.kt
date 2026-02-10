package com.swmansion.rnscreens.gamma.tabs.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

class TabsHostTabBarHeightChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val tabBarHeightInDp: Double,
) : Event<TabsHostTabBarHeightChangeEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun getCoalescingKey(): Short = tabBarHeightInDp.toInt().toShort()

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putDouble(EVENT_KEY_HEIGHT, tabBarHeightInDp)
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topTabBarHeightChange"
        const val EVENT_REGISTRATION_NAME = "onTabBarHeightChange"

        private const val EVENT_KEY_HEIGHT = "height"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
