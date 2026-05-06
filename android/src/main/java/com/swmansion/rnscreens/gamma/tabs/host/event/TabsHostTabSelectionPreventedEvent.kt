package com.swmansion.rnscreens.gamma.tabs.host.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.swmansion.rnscreens.gamma.common.event.NamingAwareEventType
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavigationState

/**
 * React Native event dispatched to JS when a tab selection is prevented because the target
 * screen has `preventNativeSelection` enabled.
 *
 * This event is never coalesced — every prevention is delivered individually.
 */
class TabsHostTabSelectionPreventedEvent(
    surfaceId: Int,
    viewId: Int,
    val currentNavState: TabsNavigationState,
    val preventedScreenKey: String,
) : Event<TabsHostTabSelectionPreventedEvent>(surfaceId, viewId),
    NamingAwareEventType {
    override fun getEventName() = EVENT_NAME

    override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME

    override fun canCoalesce(): Boolean = false

    override fun getEventData(): WritableMap? =
        Arguments.createMap().apply {
            putString(EK_SELECTED_KEY, currentNavState.selectedScreenKey)
            putInt(EK_PROVENANCE, currentNavState.provenance)
            putString(EK_PREVENTED_KEY, preventedScreenKey)
        }

    companion object : NamingAwareEventType {
        const val EVENT_NAME = "topTabSelectionPrevented"
        const val EVENT_REGISTRATION_NAME = "onTabSelectionPrevented"

        private const val EK_SELECTED_KEY = "selectedScreenKey"
        private const val EK_PROVENANCE = "provenance"
        private const val EK_PREVENTED_KEY = "preventedScreenKey"

        override fun getEventName() = EVENT_NAME

        override fun getEventRegistrationName() = EVENT_REGISTRATION_NAME
    }
}
