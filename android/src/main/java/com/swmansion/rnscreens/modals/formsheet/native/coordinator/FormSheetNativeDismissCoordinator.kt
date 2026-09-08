package com.swmansion.rnscreens.modals.formsheet.native.coordinator

import androidx.activity.OnBackPressedCallback
import com.swmansion.rnscreens.modals.formsheet.native.core.FormSheetDialog

internal class FormSheetNativeDismissCoordinator(
    private val dialog: FormSheetDialog,
    private val behaviorController: FormSheetBehaviorController?,
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
    }

    internal fun destroy() {
        dialog.cancelRequestInterceptor = null
        preventNativeDismissBackPressCallback.remove()
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
