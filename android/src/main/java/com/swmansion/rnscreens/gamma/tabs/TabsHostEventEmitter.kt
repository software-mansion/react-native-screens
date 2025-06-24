package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.event.TabsHostNativeFocusChangeEvent

internal class TabsHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnNativeFocusChange(tabKey: String) {
        reactEventDispatcher.dispatchEvent(TabsHostNativeFocusChangeEvent(surfaceId, viewTag, tabKey))
    }
}
