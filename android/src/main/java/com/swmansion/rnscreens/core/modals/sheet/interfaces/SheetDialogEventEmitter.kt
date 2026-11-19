package com.swmansion.rnscreens.core.modals.sheet.interfaces

import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter

internal interface SheetDialogEventEmitter : ViewAppearanceEventEmitter {
    fun emitOnDismissEvent()

    fun emitOnNativeDismissEvent()

    fun emitOnNativeDismissPreventedEvent()

    fun emitOnDetentChanged(index: Int)
}
