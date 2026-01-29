package com.swmansion.rnscreens.gamma.common.event

internal interface NamingAwareEventType {
    /**
     * React event name with `top` prefix
     */
    fun getEventName(): String

    /**
     * Name of the event as expected in Element Tree.
     */
    fun getEventRegistrationName(): String
}
