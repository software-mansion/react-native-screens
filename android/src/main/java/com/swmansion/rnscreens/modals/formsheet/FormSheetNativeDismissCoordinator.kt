package com.swmansion.rnscreens.modals.formsheet

import androidx.activity.OnBackPressedCallback
import com.swmansion.rnscreens.modals.dimmingview.DimmingViewManager

internal class FormSheetNativeDismissCoordinator(
    private val dialog: FormSheetDialog,
    private val behaviorController: FormSheetBehaviorController?,
    private val dimmingManager: DimmingViewManager,
    private val onDismissAllowed: () -> Unit,
    private val onDismissPrevented: () -> Unit,
) : FormSheetDialog.CancelRequestInterceptor {
    private val preventNativeDismissBackPressCallback =
        object : OnBackPressedCallback(false) {
            override fun handleOnBackPressed() {
                handleCancelRequest()
            }
        }

    internal var shouldPreventDismiss: Boolean = false
        set(value) {
            field = value
            preventNativeDismissBackPressCallback.isEnabled = value
        }

    internal fun setup() {
        dialog.cancelRequestInterceptor = this
        dialog.onBackPressedDispatcher.addCallback(preventNativeDismissBackPressCallback)
        // Backdrop taps go through `cancel()` rather than dismissing directly, so that they are
        // subject to the very same interception as the back press and the swipe down.
        dimmingManager.setOnBackdropClickListener { dialog.cancel() }
    }

    internal fun destroy() {
        dialog.cancelRequestInterceptor = null
        preventNativeDismissBackPressCallback.remove()
        dimmingManager.setOnBackdropClickListener(null)
    }

    override fun handleCancelRequest() {
        if (shouldPreventDismiss) {
            onDismissPrevented()
            behaviorController?.restoreLastStableState()
            return
        }

        onDismissAllowed()
    }
}
