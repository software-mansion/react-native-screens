package com.swmansion.rnscreens.gamma.stack.screen.event

import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackScreenNativeDismissPreventedEvent(
    surfaceId: Int,
    viewId: Int,
) : StackScreenLifecycleEvent<StackScreenNativeDismissPreventedEvent>(
        surfaceId,
        viewId,
        EVENT_NAME,
        EVENT_REGISTRATION_NAME,
    ) {
    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topNativeDismissPrevented"
        const val EVENT_REGISTRATION_NAME = "onNativeDismissPrevented"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
