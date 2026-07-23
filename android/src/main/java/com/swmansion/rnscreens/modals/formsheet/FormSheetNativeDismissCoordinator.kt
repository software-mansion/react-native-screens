package com.swmansion.rnscreens.modals.formsheet

import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.modals.dimmingview.DimmingViewManager

internal class FormSheetNativeDismissCoordinator(
    private val dialog: BottomSheetDialog,
    private val dimmingManager: DimmingViewManager,
    private val onNativeDismiss: () -> Unit,
) {
    internal fun setup() {
        dialog.setOnCancelListener {
            onNativeDismiss()
        }

        dimmingManager.setOnBackdropClickListener {
            onNativeDismiss()
        }
    }

    internal fun destroy() {
        dimmingManager.setOnBackdropClickListener {}
        dialog.setOnCancelListener(null)
    }
}
