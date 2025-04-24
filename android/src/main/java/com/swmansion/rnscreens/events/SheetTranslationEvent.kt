package com.swmansion.rnscreens.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class SheetTranslationEvent(
    surfaceId: Int,
    viewId: Int,
    private val y: Float,
) : Event<SheetTranslationEvent>(surfaceId, viewId) {
    override fun getEventName(): String = EVENT_NAME

    // All events for a given view can be coalesced.
    override fun getCoalescingKey(): Short = 0

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putDouble("y", y.toDouble())
        }

    companion object {
        const val EVENT_NAME = "topSheetTranslation"
    }
}
