package com.swmansion.rnscreens.gamma.modals.formsheet

internal data class FormSheetConfig(
    val isOpen: Boolean = false,
    val detents: List<Double> = emptyList(),
    val prefersGrabberVisible: Boolean = false,
    val initialDetentIndex: Int = 0,
    val preferredCornerRadius: Float = SYSTEM_DEFAULT_CORNER_RADIUS,
) {
    companion object {
        const val SYSTEM_DEFAULT_CORNER_RADIUS = -1f
    }
}
