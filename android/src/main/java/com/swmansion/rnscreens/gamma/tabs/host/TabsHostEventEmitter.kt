package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.container.TabsNavState
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostTabSelectedEvent
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostTabSelectionRejectedEvent

internal class TabsHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnTabSelectedEvent(
        selectedScreenKey: String,
        provenance: Int,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        isNativeAction: Boolean,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabSelectedEvent(
                surfaceId,
                viewTag,
                selectedScreenKey,
                provenance,
                isRepeated,
                hasTriggeredSpecialEffect,
                isNativeAction,
            ),
        )
    }

    fun emitOnTabSelectionRejectedEvent(
        currentNavState: TabsNavState,
        rejectedNavState: TabsNavState,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabSelectionRejectedEvent(
                surfaceId,
                viewTag,
                currentNavState,
                rejectedNavState,
            ),
        )
    }
}
