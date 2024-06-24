package com.swmansion.rnscreens.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class SheetDetentChangedEvent(
    surfaceId: Int,
    viewId: Int,
    val index: Int,
    val isStable: Boolean,
) : Event<SheetDetentChangedEvent>(surfaceId, viewId) {
    override fun getEventName() = EVENT_NAME

    // All events for a given view can be coalesced.
    override fun getCoalescingKey(): Short = 0

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putInt("index", index)
            putBoolean("isStable", isStable)
        }

    companion object {
        const val EVENT_NAME = "topSheetDetentChanged"
    }
}
