package com.swmansion.rnscreens.stack.screen

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.common.event.BaseEventEmitter
import com.swmansion.rnscreens.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.stack.screen.event.StackScreenDidAppearEvent
import com.swmansion.rnscreens.stack.screen.event.StackScreenDidDisappearEvent
import com.swmansion.rnscreens.stack.screen.event.StackScreenDismissEvent
import com.swmansion.rnscreens.stack.screen.event.StackScreenNativeDismissPreventedEvent
import com.swmansion.rnscreens.stack.screen.event.StackScreenWillAppearEvent
import com.swmansion.rnscreens.stack.screen.event.StackScreenWillDisappearEvent

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

    internal fun emitOnDismiss(isNativeDismiss: Boolean) {
        reactEventDispatcher.dispatchEvent(
            StackScreenDismissEvent(
                surfaceId,
                viewTag,
                isNativeDismiss,
            ),
        )
    }

    internal fun emitOnNativeDismissPrevented() {
        reactEventDispatcher.dispatchEvent(
            StackScreenNativeDismissPreventedEvent(
                surfaceId,
                viewTag,
            ),
        )
    }

    companion object {
        const val TAG = "StackScreenEventEmitter"
    }
}
