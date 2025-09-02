package com.swmansion.rnscreens.gamma.tabs.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.NamingAwareEventType

class TabsSafeAreaViewNativeLayoutEvent(surfaceId: Int, viewId: Int, val tabBarHeight: Int) : Event<TabsSafeAreaViewNativeLayoutEvent>(surfaceId, viewId) {
    override fun getEventName() = EVENT_HANE

    override fun getCoalescingKey(): Short = tabBarHeight.toShort() // if this fails something went seriously wrong anyway

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putInt(EVENT_KEY_TAB_BAR_HEIGHT, tabBarHeight)
        }

    companion object : NamingAwareEventType {
        const val EVENT_HANE = "topNativeLayout"
        const val EVENT_REGISTRATION_NAME = "onNativeLayout"

        // Keep in sync with keys in component spec
        private const val EVENT_KEY_TAB_BAR_HEIGHT = "tabBarHeight"

        override fun getEventName() = EVENT_HANE
        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}