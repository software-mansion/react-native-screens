package com.swmansion.rnscreens.gamma.tabs.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.NamingAwareEventType

class TabsHostNativeFocusChangeEvent(
    surfaceId: Int,
    viewId: Int,
    val tabKey: String,
    val tabNumber: Int,
    val repeatedSelectionHandledBySpecialEffect: Boolean,
) : Event<TabScreenDidAppearEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun getCoalescingKey(): Short = (tabNumber * 10 + if (repeatedSelectionHandledBySpecialEffect) 1 else 0).toShort()

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putString(EVENT_KEY_TAB_KEY, tabKey)
            putBoolean(
                EVENT_KEY_REPEATED_SELECTION_HANDLED_BY_SPECIAL_EFFECT,
                repeatedSelectionHandledBySpecialEffect,
            )
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topNativeFocusChange"
        const val EVENT_REGISTRATION_NAME = "onNativeFocusChange"

        private const val EVENT_KEY_TAB_KEY = "tabKey"
        private const val EVENT_KEY_REPEATED_SELECTION_HANDLED_BY_SPECIAL_EFFECT =
            "repeatedSelectionHandledBySpecialEffect"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
