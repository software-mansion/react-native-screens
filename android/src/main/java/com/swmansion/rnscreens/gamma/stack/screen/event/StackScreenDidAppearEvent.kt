package com.swmansion.rnscreens.gamma.stack.screen.event

import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackScreenDidAppearEvent(
    surfaceId: Int,
    viewId: Int,
) : StackScreenLifecycleEvent<StackScreenDidAppearEvent>(
        surfaceId,
        viewId,
        EVENT_NAME,
        EVENT_REGISTRATION_NAME,
    ) {
    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topDidAppear"
        const val EVENT_REGISTRATION_NAME = "onDidAppear"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
