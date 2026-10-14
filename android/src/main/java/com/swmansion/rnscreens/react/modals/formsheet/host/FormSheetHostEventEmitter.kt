package com.swmansion.rnscreens.react.modals.formsheet.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.common.event.BaseEventEmitter
import com.swmansion.rnscreens.core.modals.formsheet.interfaces.FormSheetDialogEventEmitter
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetDetentChangedEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetDidAppearEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetDidDisappearEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetDismissEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetNativeDismissEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetNativeDismissPreventedEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetSyncFlushEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetWillAppearEvent
import com.swmansion.rnscreens.react.modals.formsheet.event.FormSheetWillDisappearEvent

internal class FormSheetHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag),
    FormSheetDialogEventEmitter {
    override fun emitOnDismissEvent() {
        reactEventDispatcher.dispatchEvent(
            FormSheetDismissEvent(surfaceId, viewTag),
        )
    }

    override fun emitOnNativeDismissEvent() {
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

    override fun emitOnDetentChanged(index: Int) {
        reactEventDispatcher.dispatchEvent(
            FormSheetDetentChangedEvent(surfaceId, viewTag, index),
        )
    }

    override fun emitOnNativeDismissPreventedEvent() {
        reactEventDispatcher.dispatchEvent(
            FormSheetNativeDismissPreventedEvent(surfaceId, viewTag),
        )
    }
}
