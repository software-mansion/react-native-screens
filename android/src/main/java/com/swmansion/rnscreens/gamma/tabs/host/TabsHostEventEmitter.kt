package com.swmansion.rnscreens.gamma.tabs.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.host.event.TabsHostTabChangeEvent

internal class TabsHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnTabChangeEvent(
        selectedScreenKey: String,
        provenance: Int,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        isNativeAction: Boolean,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabChangeEvent(
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
}
