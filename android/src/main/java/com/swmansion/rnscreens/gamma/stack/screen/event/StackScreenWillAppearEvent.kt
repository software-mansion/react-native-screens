package com.swmansion.rnscreens.gamma.stack.screen.event

import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackScreenWillAppearEvent(
    surfaceId: Int,
    viewId: Int,
) : StackScreenLifecycleEvent<StackScreenWillAppearEvent>(
        surfaceId,
        viewId,
        EVENT_NAME,
        EVENT_REGISTRATION_NAME,
    ) {
    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topWillAppear"
        const val EVENT_REGISTRATION_NAME = "onWillAppear"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
