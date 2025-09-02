package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.event.TabsSafeAreaViewNativeLayoutEvent
import com.swmansion.rnscreens.utils.RNSLog

internal class TabsSafeAreaViewEventEmitter(reactContext: ReactContext, viewTag: Int) : BaseEventEmitter(reactContext, viewTag) {
    internal var lastDispatchedHeight: Int = -1

    fun emitOnNativeLayout(tabBarHeight: Int, deduplicate: Boolean = true) {
        if (deduplicate && lastDispatchedHeight == tabBarHeight) {
            return
        }

        RNSLog.d("[RNScreens]", "Emitting native layout: $tabBarHeight")

        reactEventDispatcher.dispatchEvent(TabsSafeAreaViewNativeLayoutEvent(surfaceId, viewTag, tabBarHeight))
        lastDispatchedHeight = tabBarHeight
    }
}