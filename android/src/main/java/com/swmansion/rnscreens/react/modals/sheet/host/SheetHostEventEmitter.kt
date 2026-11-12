package com.swmansion.rnscreens.react.modals.sheet.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetDialogEventEmitter
import com.swmansion.rnscreens.react.common.event.BaseEventEmitter
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDetentChangedEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDidAppearEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDidDisappearEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDismissEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetNativeDismissEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetNativeDismissPreventedEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetSyncFlushEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetWillAppearEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetWillDisappearEvent

internal class SheetHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag),
    SheetDialogEventEmitter {
    override fun emitOnDismissEvent() {
        reactEventDispatcher.dispatchEvent(
            SheetDismissEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnNativeDismissEvent() {
        reactEventDispatcher.dispatchEvent(
            SheetNativeDismissEvent(surfaceId, viewTag),
        )
    }

    fun emitOnSyncFlushEvent() {
        reactEventDispatcher.dispatchEvent(
            SheetSyncFlushEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnWillAppear() {
        reactEventDispatcher.dispatchEvent(
            SheetWillAppearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnDidAppear() {
        reactEventDispatcher.dispatchEvent(
            SheetDidAppearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnWillDisappear() {
        reactEventDispatcher.dispatchEvent(
            SheetWillDisappearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnDidDisappear() {
        reactEventDispatcher.dispatchEvent(
            SheetDidDisappearEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnDetentChanged(index: Int) {
        reactEventDispatcher.dispatchEvent(
            SheetDetentChangedEvent(surfaceId, viewTag, index),
        )
    }

    override fun emitOnNativeDismissPreventedEvent() {
        reactEventDispatcher.dispatchEvent(
            SheetNativeDismissPreventedEvent(surfaceId, viewTag),
        )
    }
}
