package com.swmansion.rnscreens.helpers

import com.swmansion.rnscreens.common.event.NamingAwareEventType

internal fun makeEventRegistrationInfo(event: NamingAwareEventType): Pair<String, HashMap<String, String>> =
    event.getEventName() to hashMapOf("registrationName" to event.getEventRegistrationName())
