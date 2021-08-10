package com.swmansion.rnscreens

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.ScreenAppearEvent
import com.swmansion.rnscreens.ScreenWillAppearEvent
import com.facebook.react.uimanager.events.RCTEventEmitter

class ScreenWillAppearEvent(viewId: Int) : Event<ScreenAppearEvent?>(viewId) {
    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun getCoalescingKey(): Short {
        // All events for a given view can be coalesced.
        return 0
    }

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        rctEventEmitter.receiveEvent(viewTag, eventName, Arguments.createMap())
    }

    companion object {
        const val EVENT_NAME = "topWillAppear"
    }
}