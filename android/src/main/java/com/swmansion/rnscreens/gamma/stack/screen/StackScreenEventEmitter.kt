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
    internal fun emitOnWillAppear() {
        reactEventDispatcher.dispatchEvent(StackScreenWillAppearEvent(surfaceId, viewTag))
    }

    internal fun emitOnDidAppear() {
        reactEventDispatcher.dispatchEvent(StackScreenDidAppearEvent(surfaceId, viewTag))
    }

    internal fun emitOnWillDisappear() {
        reactEventDispatcher.dispatchEvent(StackScreenWillDisappearEvent(surfaceId, viewTag))
    }

    internal fun emitOnDidDisappear() {
        reactEventDispatcher.dispatchEvent(StackScreenDidDisappearEvent(surfaceId, viewTag))
    }

    internal fun emitOnDismiss(isNativeDismiss: Boolean) {
        reactEventDispatcher.dispatchEvent(
            StackScreenDismissEvent(
                surfaceId,
                viewTag,
                isNativeDismiss,
            ),
        )
    }

    companion object {
        const val TAG = "StackScreenEventEmitter"
    }
}
