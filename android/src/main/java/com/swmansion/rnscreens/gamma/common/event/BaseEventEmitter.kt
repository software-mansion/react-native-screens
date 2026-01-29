package com.swmansion.rnscreens.gamma.common.event

import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.EventDispatcher

internal abstract class BaseEventEmitter(
    val reactContext: ReactContext,
    val viewTag: Int,
) {
    protected val reactEventDispatcher: EventDispatcher =
        checkNotNull(UIManagerHelper.getEventDispatcherForReactTag(reactContext, viewTag)) {
            "[RNScreens] Nullish event dispatcher for view with tag: $viewTag"
        }

    protected val surfaceId: Int
        get() = UIManagerHelper.getSurfaceId(reactContext)

    companion object {
        const val TAG = "BaseEventEmitter"
    }
}
