package com.swmansion.rnscreens.gamma.helpers

import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType

internal fun makeEventRegistrationInfo(event: NamingAwareEventType): Pair<String, HashMap<String, String>> =
    event.getEventName() to hashMapOf("registrationName" to event.getEventRegistrationName())
