package com.swmansion.rnscreens.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class HeaderHeightChangeEvent(
    viewId: Int,
    private val mNewHeight: Int
) : Event<HeaderHeightChangeEvent>(viewId) {

    override fun getEventName() = EVENT_NAME

    // As the same header height could appear twice, use header height as a coalescing key.
    override fun getCoalescingKey(): Short = mNewHeight.toShort()

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        val map = Arguments.createMap()
        map.putDouble("newHeight", mNewHeight.toDouble())
        rctEventEmitter.receiveEvent(viewTag, eventName, map)
    }

    companion object {
        const val EVENT_NAME = "topHeaderHeightChange"
    }
}
