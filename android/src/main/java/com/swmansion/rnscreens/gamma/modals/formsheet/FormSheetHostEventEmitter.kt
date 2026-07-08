package com.swmansion.rnscreens.gamma.modals.formsheet

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter

internal class FormSheetHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag) {
    fun emitOnNativeDismissEvent() {
        reactEventDispatcher.dispatchEvent(
            FormSheetNativeDismissEvent(surfaceId, viewTag),
        )
    }

    fun emitOnSyncFlushEvent() {
        reactEventDispatcher.dispatchEvent(
            FormSheetSyncFlushEvent(surfaceId, viewTag),
        )
    }

    fun emitOnWillAppear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetWillAppearEvent(surfaceId, viewTag),
        )
    }

    fun emitOnDidAppear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetDidAppearEvent(surfaceId, viewTag),
        )
    }

    fun emitOnWillDisappear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetWillDisappearEvent(surfaceId, viewTag),
        )
    }

    fun emitOnDidDisappear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetDidDisappearEvent(surfaceId, viewTag),
        )
    }
}
