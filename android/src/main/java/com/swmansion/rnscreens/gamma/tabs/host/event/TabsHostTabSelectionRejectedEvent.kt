package com.swmansion.rnscreens.gamma.tabs.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationState
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateRejectionReason
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationStateUpdateRequest

/**
 * React Native event dispatched to JS when a tab selection request is rejected by the container.
 *
 * Carries the currently active navigation state ([currentNavState]), the rejected request
 * ([rejectedRequest]), and the [rejectionReason]. This event is never coalesced — every
 * rejection is delivered individually so the JS side has a complete picture of state transitions.
 */
class TabsHostTabSelectionRejectedEvent(
    surfaceId: Int,
    viewId: Int,
    val currentNavState: TabsNavigationState,
    val rejectedRequest: TabsNavigationStateUpdateRequest,
    val rejectionReason: TabsNavigationStateRejectionReason,
) : Event<TabsHostTabSelectionRejectedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    // This event should never be coalesced. It informs JS side of all navigation events that happen.
    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putString(EK_SELECTED_KEY, currentNavState.selectedScreenKey)
            putInt(EK_PROVENANCE, currentNavState.provenance)
            putString(EK_REJECTED_KEY, rejectedRequest.selectedScreenKey)
            putInt(EK_REJECTED_BASE_PROVENANCE, rejectedRequest.baseProvenance)
            putString(EK_REJECTION_REASON, rejectionReason.toString())
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topTabSelectionRejected"
        const val EVENT_REGISTRATION_NAME = "onTabSelectionRejected"

        private const val EK_SELECTED_KEY = "selectedScreenKey"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_REJECTED_KEY = "rejectedScreenKey"
        private const val EK_REJECTED_BASE_PROVENANCE = "rejectedBaseProvenance"
        private const val EK_REJECTION_REASON = "rejectionReason"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
