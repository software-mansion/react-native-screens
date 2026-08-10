package com.swmansion.rnscreens.modals.formsheet.native.presentation

internal enum class FormSheetDismissalOrigin {
    /**
     * The dismissal was requested from JS by setting `isOpen = false`.
     * Emits `onDismiss`.
     */
    PROGRAMMATIC,

    /**
     * The dismissal was initiated by the user (swiping the sheet down,
     * triggering the native back button, or tapping the backdrop).
     * Emits `onNativeDismiss`.
     */
    NATIVE,
}
