package com.swmansion.rnscreens.gamma.modals.formsheet

internal data class FormSheetConfig(
    val isOpen: Boolean = false,
    val detents: List<Double> = emptyList(),
    val prefersGrabberVisible: Boolean = false,
)
