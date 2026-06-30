// Implementation adapted from `expo`: https://github.com/expo/expo/pull/45775

package com.swmansion.rnscreens.gamma.modals.formsheet

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

// Workaround helper that triggers a synchronous event to flush a pending
// shadow-node state update in the current event beat. Mirrors iOS's
// `EventQueue::UpdateMode::unstable_Immediate`, which Android does not expose
// to Java/Kotlin as of now.
// TODO: Remove when a synchronous state update API is exposed on Android.
// https://github.com/facebook/react-native/pull/56311
class FormSheetSyncFlushEvent(
    surfaceId: Int,
    viewId: Int,
) : Event<FormSheetSyncFlushEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName(): String = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun getEventData(): WritableMap? = Arguments.createMap()

    override fun canCoalesce(): Boolean = false

    override fun experimental_isSynchronous(): Boolean = true

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topSyncFlush"
        const val EVENT_REGISTRATION_NAME = "onSyncFlush"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
