package com.swmansion.rnscreens.gamma.tabs.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavState
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavStateUpdateRejectionReason

/**
 * React Native event dispatched to JS when a tab selection request is rejected by the container.
 *
 * Carries the currently active navigation state ([currentNavState]), the rejected update
 * ([rejectedNavState]), and the [rejectionReason]. This event is never coalesced — every
 * rejection is delivered individually so the JS side has a complete picture of state transitions.
 */
class TabsHostTabSelectionRejectedEvent(
    surfaceId: Int,
    viewId: Int,
    val currentNavState: TabsNavState,
    val rejectedNavState: TabsNavState,
    val rejectionReason: TabsNavStateUpdateRejectionReason,
) : Event<TabsHostTabSelectionRejectedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    // This event should never be coalesced. It informs JS side of all navigation events that happen.
    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putString(EK_SELECTED_KEY, currentNavState.selectedKey)
            putInt(EK_PROVENANCE, currentNavState.provenance)
            putString(EK_REJECTED_KEY, rejectedNavState.selectedKey)
            putInt(EK_REJECTED_PROVENANCE, rejectedNavState.provenance)
            putString(EK_REJECTION_REASON, rejectionReason.toString())
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topTabSelectionRejected"
        const val EVENT_REGISTRATION_NAME = "onTabSelectionRejected"

        private const val EK_SELECTED_KEY = "selectedScreenKey"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_REJECTED_KEY = "rejectedScreenKey"
        private const val EK_REJECTED_PROVENANCE = "rejectedProvenance"
        private const val EK_REJECTION_REASON = "rejectionReason"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
