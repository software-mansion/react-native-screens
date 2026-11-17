package com.swmansion.rnscreens.core.modals.sheet.model

internal data class SheetConfig(
    val isOpen: Boolean = false,
    val detents: List<Double> = emptyList(),
    val prefersGrabberVisible: Boolean = false,
    val initialDetentIndex: Int = 0,
    val preferredCornerRadius: Float = SYSTEM_DEFAULT_CORNER_RADIUS,
    val preventNativeDismiss: Boolean = false,
    val nativeContainerBackgroundColor: Int? = null,
) {
    val shouldPreventNativeDismiss: Boolean
        get() = preventNativeDismiss && isOpen

    companion object {
        const val SYSTEM_DEFAULT_CORNER_RADIUS = -1f
    }
}
