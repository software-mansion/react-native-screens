package com.swmansion.rnscreens.gamma.modals.formsheet

import com.swmansion.rnscreens.gamma.common.event.ViewAppearanceEventEmitter

internal interface FormSheetDialogEventEmitter : ViewAppearanceEventEmitter {
    fun emitOnNativeDismissEvent()

    fun emitOnDetentChanged(index: Int)
}
