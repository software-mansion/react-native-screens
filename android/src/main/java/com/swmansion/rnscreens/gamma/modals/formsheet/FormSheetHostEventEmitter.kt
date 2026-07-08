package com.swmansion.rnscreens.gamma.modals.formsheet

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.common.event.BaseEventEmitter
import com.swmansion.rnscreens.gamma.common.event.ViewAppearanceEventEmitter

internal class FormSheetHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag),
    ViewAppearanceEventEmitter {
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

    override fun emitOnWillAppear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetWillAppearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnDidAppear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetDidAppearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnWillDisappear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetWillDisappearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnDidDisappear() {
        reactEventDispatcher.dispatchEvent(
            FormSheetDidDisappearEvent(surfaceId, viewTag),
        )
    }
}
