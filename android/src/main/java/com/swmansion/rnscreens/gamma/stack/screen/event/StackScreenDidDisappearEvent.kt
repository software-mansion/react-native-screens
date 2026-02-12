package com.swmansion.rnscreens.gamma.stack.screen.event

import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal class StackScreenDidDisappearEvent(
    surfaceId: Int,
    viewId: Int,
) : StackScreenLifecycleEvent<StackScreenDidDisappearEvent>(
        surfaceId,
        viewId,
        EVENT_NAME,
        EVENT_REGISTRATION_NAME,
    ) {
    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topDidDisappear"
        const val EVENT_REGISTRATION_NAME = "onDidDisappear"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
