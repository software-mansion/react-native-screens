package com.swmansion.rnscreens.gamma.modals.formsheet

import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetLifecycleCoordinator(
    private val dialog: BottomSheetDialog,
    private val dimmingManager: DimmingViewManager,
    private val onDismiss: () -> Unit,
) {
    internal fun setup() {
        dialog.setOnCancelListener {
            onDismiss()
        }

        dimmingManager.setOnBackdropClickListener {
            onDismiss()
        }
    }

    internal fun destroy() {
        dimmingManager.setOnBackdropClickListener {}
        dialog.setOnCancelListener(null)
    }
}
