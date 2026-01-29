package com.swmansion.rnscreens.gamma.stack.screen.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackScreenDismissEvent(
    surfaceId: Int,
    viewId: Int,
    val isNativeDismiss: Boolean,
) : StackScreenLifecycleEvent<StackScreenDismissEvent>(
        surfaceId,
        viewId,
        EVENT_NAME,
        EVENT_REGISTRATION_NAME,
    ) {
    override fun getEventData(): WritableMap =
        Arguments.createMap().apply {
            putBoolean(EVENT_KEY_IS_NATIVE_DISMISS, isNativeDismiss)
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topDismiss"
        const val EVENT_REGISTRATION_NAME = "onDismiss"

        private const val EVENT_KEY_IS_NATIVE_DISMISS = "isNativeDismiss"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
