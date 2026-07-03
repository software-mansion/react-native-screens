package com.swmansion.rnscreens.gamma.modals.formsheet

internal class FormSheetInvalidationFlags(
    var isPresentationInvalidated: Boolean = false,
    var isAppearanceInvalidated: Boolean = false,
    var isBehaviorInvalidated: Boolean = false,
) {
    internal fun any(): Boolean =
        isPresentationInvalidated || isAppearanceInvalidated || isBehaviorInvalidated
}
