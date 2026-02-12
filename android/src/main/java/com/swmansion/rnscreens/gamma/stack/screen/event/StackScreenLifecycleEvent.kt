package com.swmansion.rnscreens.gamma.stack.screen.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal abstract class StackScreenLifecycleEvent<T : Event<T>>(
    surfaceId: Int,
    viewId: Int,
    private val name: String,
    private val registrationName: String,
) : Event<T>(surfaceId, viewId),
    NamingAwareEventType {
    // All events for given view can be coalesced.
    override fun getCoalescingKey(): Short = 0

    override fun getEventData(): WritableMap? = Arguments.createMap()

    override fun getEventName() = name

    override fun getEventRegistrationName() = registrationName
}
