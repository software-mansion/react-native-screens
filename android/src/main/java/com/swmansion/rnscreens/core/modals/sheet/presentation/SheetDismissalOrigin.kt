package com.swmansion.rnscreens.core.modals.sheet.presentation

internal enum class SheetDismissalOrigin {
    /**
     * No dismissal request is pending. Completing a dismissal with this
     * origin should report an error.
     */
    UNSPECIFIED,

    /**
     * The dismissal was requested from JS by setting `isOpen = false`.
     * Emits `onDismiss`.
     */
    PROGRAMMATIC_JS,

    /**
     * The dismissal was initiated by the user (swiping the sheet down,
     * triggering the native back button, or tapping the backdrop).
     * Emits `onNativeDismiss`.
     */
    USER,
}
