package com.swmansion.rnscreens.modals.formsheet.react.host

import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.common.event.BaseEventEmitter
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetDetentChangedEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetDidAppearEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetDidDisappearEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetNativeDismissEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetNativeDismissPreventedEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetSyncFlushEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetWillAppearEvent
import com.swmansion.rnscreens.modals.formsheet.react.event.FormSheetWillDisappearEvent
import com.swmansion.rnscreens.modals.formsheet.shared.contracts.FormSheetDialogEventEmitter

internal class FormSheetHostEventEmitter(
    reactContext: ReactContext,
    viewTag: Int,
) : BaseEventEmitter(reactContext, viewTag),
    FormSheetDialogEventEmitter {
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
