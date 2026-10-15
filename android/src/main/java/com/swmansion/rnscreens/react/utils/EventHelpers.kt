package com.swmansion.rnscreens.react.utils

import com.swmansion.rnscreens.react.common.event.NamingAwareEventType

internal fun makeEventRegistrationInfo(event: NamingAwareEventType): Pair<String, HashMap<String, String>> =
    event.getEventName() to hashMapOf("registrationName" to event.getEventRegistrationName())
