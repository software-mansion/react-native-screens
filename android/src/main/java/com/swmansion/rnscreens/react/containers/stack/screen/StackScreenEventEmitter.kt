package com.swmansion.rnscreens.react.containers.stack.screen

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.react.common.event.BaseEventEmitter
import com.swmansion.rnscreens.react.containers.stack.screen.event.StackScreenDidAppearEvent
import com.swmansion.rnscreens.react.containers.stack.screen.event.StackScreenDidDisappearEvent
import com.swmansion.rnscreens.react.containers.stack.screen.event.StackScreenWillAppearEvent
import com.swmansion.rnscreens.react.containers.stack.screen.event.StackScreenWillDisappearEvent

internal class StackScreenEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag),
    ViewAppearanceEventEmitter {
    override fun emitOnWillAppear() {
        reactEventDispatcher.dispatchEvent(StackScreenWillAppearEvent(surfaceId, viewTag))
    }

    override fun emitOnDidAppear() {
        reactEventDispatcher.dispatchEvent(StackScreenDidAppearEvent(surfaceId, viewTag))
    }

    override fun emitOnWillDisappear() {
        reactEventDispatcher.dispatchEvent(StackScreenWillDisappearEvent(surfaceId, viewTag))
    }

    override fun emitOnDidDisappear() {
        reactEventDispatcher.dispatchEvent(StackScreenDidDisappearEvent(surfaceId, viewTag))
    }

    companion object {
        const val TAG = "StackScreenEventEmitter"
    }
}
