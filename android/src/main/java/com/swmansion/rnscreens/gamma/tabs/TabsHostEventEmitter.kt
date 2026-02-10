package com.swmansion.rnscreens.gamma.tabs

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.tabs.event.TabsHostNativeFocusChangeEvent
import com.swmansion.rnscreens.gamma.tabs.event.TabsHostTabBarHeightChangeEvent

internal class TabsHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnNativeFocusChange(
        tabKey: String,
        tabNumber: Int,
        repeatedSelectionHandledBySpecialEffect: Boolean,
    ) {
        reactEventDispatcher.dispatchEvent(
            TabsHostNativeFocusChangeEvent(
                surfaceId,
                viewTag,
                tabKey,
                tabNumber,
                repeatedSelectionHandledBySpecialEffect,
            ),
        )
    }

    fun emitOnTabBarHeightChange(tabBarHeight: Double) {
        reactEventDispatcher.dispatchEvent(
            TabsHostTabBarHeightChangeEvent(
                surfaceId,
                viewTag,
                tabBarHeight,
            ),
        )
    }
}
