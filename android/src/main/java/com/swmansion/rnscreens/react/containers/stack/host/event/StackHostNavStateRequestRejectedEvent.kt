package com.swmansion.rnscreens.react.containers.stack.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationState
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRejectionReason
import com.swmansion.rnscreens.core.containers.stack.host.StackNavigationStateRequest
import com.swmansion.rnscreens.react.common.event.NamingAwareEventType

/**
 * React Native event dispatched to JS when the stack rejects a navigation state request.
 *
 * Carries the current navigation state ([currentNavState]), the rejected request ([rejectedRequest]) and the
 * [rejectionReason]. This event is never coalesced — every rejection is delivered individually.
 */
internal class StackHostNavStateRequestRejectedEvent(
    surfaceId: Int,
    viewId: Int,
    val currentNavState: StackNavigationState,
    val rejectedRequest: StackNavigationStateRequest,
    val rejectionReason: StackNavigationStateRejectionReason,
) : Event<StackHostNavStateRequestRejectedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putArray(EK_STACK, Arguments.fromList(currentNavState.stack))
            putInt(EK_PROVENANCE, currentNavState.provenance)
            putArray(EK_REJECTED_STACK, Arguments.fromList(rejectedRequest.stack))
            putInt(EK_REJECTED_BASE_PROVENANCE, rejectedRequest.baseProvenance)
            putString(EK_REJECTION_REASON, rejectionReason.toString())
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topNavStateRequestRejected"
        const val EVENT_REGISTRATION_NAME = "onNavStateRequestRejected"

        private const val EK_STACK = "stack"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_REJECTED_STACK = "rejectedStack"
        private const val EK_REJECTED_BASE_PROVENANCE = "rejectedBaseProvenance"
        private const val EK_REJECTION_REASON = "rejectionReason"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
