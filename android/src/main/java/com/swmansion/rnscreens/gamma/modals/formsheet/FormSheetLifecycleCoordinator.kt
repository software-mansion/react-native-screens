package com.swmansion.rnscreens.gamma.modals.formsheet

import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

internal class FormSheetLifecycleCoordinator(
    private val dialog: BottomSheetDialog,
    private val bottomSheetView: FrameLayout?,
    private val dimmingManager: DimmingViewManager,
    private val animationCoordinator: FormSheetAnimationCoordinator,
    private val onDismissRequest: () -> Unit,
) {
    internal fun setup() {
        dialog.setOnShowListener {
            dimmingManager.onDialogShown()
            bottomSheetView?.let { view ->
                animationCoordinator.runEnterAnimation(view)
            }
        }

        dialog.setOnCancelListener {
            onDismissRequest()
        }

        dimmingManager.setOnBackdropClickListener { onDismissRequest() }
    }

    internal fun destroy() {
        dimmingManager.setOnBackdropClickListener {}
        dialog.setOnShowListener(null)
        dialog.setOnCancelListener(null)
    }
}
