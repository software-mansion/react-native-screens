package com.swmansion.rnscreens.gamma.stack.header.config

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.stack.header.toolbar.event.StackHeaderToolbarMenuItemPressEvent

internal class StackHeaderConfigEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    internal fun emitOnToolbarMenuItemPress(id: String) {
        reactEventDispatcher.dispatchEvent(
            StackHeaderToolbarMenuItemPressEvent(surfaceId, viewTag, id),
        )
    }
}
