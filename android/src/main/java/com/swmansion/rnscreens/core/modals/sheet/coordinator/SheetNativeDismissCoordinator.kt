package com.swmansion.rnscreens.core.modals.sheet.coordinator

import androidx.activity.OnBackPressedCallback
import com.swmansion.rnscreens.core.modals.sheet.dialog.SheetDialog

internal class SheetNativeDismissCoordinator(
    private val dialog: SheetDialog,
    private val behaviorController: SheetBehaviorController?,
    private val onDismissAllowed: () -> Unit,
    private val onDismissPrevented: () -> Unit,
) : SheetDialog.CancelRequestInterceptor {
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
