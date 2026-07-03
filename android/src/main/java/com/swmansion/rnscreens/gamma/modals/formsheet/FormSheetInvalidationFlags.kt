package com.swmansion.rnscreens.gamma.modals.formsheet

class FormSheetInvalidationFlags(
    var isPresentationInvalidated: Boolean = false,
    var isAppearanceInvalidated: Boolean = false,
    var isBehaviorInvalidated: Boolean = false,
) {
    internal fun any(): Boolean =
        isPresentationInvalidated || isAppearanceInvalidated || isBehaviorInvalidated
}
