package com.swmansion.rnscreens

import com.facebook.react.bridge.Arguments
import com.swmansion.rnscreens.ScreenDismissedEvent
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class ScreenDismissedEvent(viewId: Int) : Event<ScreenDismissedEvent?>(viewId) {
    override fun getEventName(): String {
        return EVENT_NAME
    }

    override fun getCoalescingKey(): Short {
        // All events for a given view can be coalesced.
        return 0
    }

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        val args = Arguments.createMap()
        // on Android we always dismiss one screen at a time
        args.putInt("dismissCount", 1)
        rctEventEmitter.receiveEvent(viewTag, eventName, args)
    }

    companion object {
        const val EVENT_NAME = "topDismissed"
    }
}