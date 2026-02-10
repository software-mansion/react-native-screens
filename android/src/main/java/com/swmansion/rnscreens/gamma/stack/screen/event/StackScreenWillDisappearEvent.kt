package com.swmansion.rnscreens.gamma.stack.screen.event

import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackScreenWillDisappearEvent(
    surfaceId: Int,
    viewId: Int,
) : StackScreenLifecycleEvent<StackScreenWillDisappearEvent>(
        surfaceId,
        viewId,
        EVENT_NAME,
        EVENT_REGISTRATION_NAME,
    ) {
    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topWillDisappear"
        const val EVENT_REGISTRATION_NAME = "onWillDisappear"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
