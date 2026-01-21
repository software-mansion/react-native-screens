package com.swmansion.rnscreens.gamma.stack.screen

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.BaseEventEmitter
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenDismissEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenWillDisappearEvent

internal class StackScreenEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnWillAppear() {
        reactEventDispatcher.dispatchEvent(StackScreenWillAppearEvent(surfaceId, viewTag))
    }

    fun emitOnDidAppear() {
        reactEventDispatcher.dispatchEvent(StackScreenDidAppearEvent(surfaceId, viewTag))
    }

    fun emitOnWillDisappear() {
        reactEventDispatcher.dispatchEvent(StackScreenWillDisappearEvent(surfaceId, viewTag))
    }

    fun emitOnDidDisappear() {
        reactEventDispatcher.dispatchEvent(StackScreenDidDisappearEvent(surfaceId, viewTag))
    }

    fun emitOnDismiss(isNativeDismiss: Boolean) {
        reactEventDispatcher.dispatchEvent(
            StackScreenDismissEvent(
                surfaceId,
                viewTag,
                isNativeDismiss
            )
        )
    }

    companion object {
        const val TAG = "StackScreenEventEmitter"
    }
}