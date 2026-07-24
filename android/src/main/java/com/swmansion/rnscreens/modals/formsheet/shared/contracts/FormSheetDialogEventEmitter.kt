package com.swmansion.rnscreens.modals.formsheet.shared.contracts

import com.swmansion.rnscreens.common.event.ViewAppearanceEventEmitter

internal interface FormSheetDialogEventEmitter : ViewAppearanceEventEmitter {
    fun emitOnNativeDismissEvent()

    fun emitOnNativeDismissPreventedEvent()

    fun emitOnDetentChanged(index: Int)
}
