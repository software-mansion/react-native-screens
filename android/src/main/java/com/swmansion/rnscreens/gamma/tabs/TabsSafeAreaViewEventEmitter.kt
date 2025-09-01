package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.event.TabsSafeAreaViewNativeLayoutEvent

internal class TabsSafeAreaViewEventEmitter(reactContext: ReactContext, viewTag: Int) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnNativeLayout(tabBarHeight: Int) {
        reactEventDispatcher.dispatchEvent(TabsSafeAreaViewNativeLayoutEvent(surfaceId, viewTag, tabBarHeight))
    }
}