package com.swmansion.rnscreens.modals.formsheet

import com.swmansion.rnscreens.common.event.ViewAppearanceEventEmitter

internal interface FormSheetDialogEventEmitter : ViewAppearanceEventEmitter {
    fun emitOnDismissEvent()

    fun emitOnNativeDismissEvent()

    fun emitOnDetentChanged(index: Int)
}
