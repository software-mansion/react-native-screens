package com.swmansion.rnscreens.gamma.stack.screen.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.NamingAwareEventType

internal abstract class StackScreenLifecycleEvent<T: Event<T>>(
    surfaceId: Int,
    viewId: Int,
): Event<T>(surfaceId, viewId), NamingAwareEventType {
    // All events for given view can be coalesced.
    override fun getCoalescingKey(): Short = 0
    override fun getEventData(): WritableMap? = Arguments.createMap()
//
//    abstract override fun getEventName(): String
//    abstract override fun getEventRegistrationName(): String
}