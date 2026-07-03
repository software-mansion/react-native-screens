package com.swmansion.rnscreens.gamma.modals.formsheet

import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetLifecycleCoordinator(
    private val dialog: BottomSheetDialog,
    private val dimmingManager: DimmingViewManager,
    private val onShow: () -> Unit,
    private val onDismiss: () -> Unit,
) {
    internal fun setup() {
        dialog.setOnShowListener {
            onShow()
        }

        dialog.setOnCancelListener {
            onDismiss()
        }

        dimmingManager.setOnBackdropClickListener {
            onDismiss()
        }
    }

    internal fun destroy() {
        dimmingManager.setOnBackdropClickListener {}
        dialog.setOnShowListener(null)
        dialog.setOnCancelListener(null)
    }
}
