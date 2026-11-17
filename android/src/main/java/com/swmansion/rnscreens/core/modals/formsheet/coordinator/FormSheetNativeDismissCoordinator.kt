package com.swmansion.rnscreens.core.modals.formsheet.coordinator

import androidx.activity.OnBackPressedCallback
import com.swmansion.rnscreens.core.modals.formsheet.dialog.FormSheetDialog

internal class FormSheetNativeDismissCoordinator(
    private val dialog: FormSheetDialog,
    private val behaviorController: FormSheetBehaviorController?,
    private val onDismissAllowed: () -> Unit,
    private val onDismissPrevented: () -> Unit,
) : FormSheetDialog.NativeDismissInterceptor {
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
        dialog.nativeDismissInterceptor = this
        dialog.onBackPressedDispatcher.addCallback(preventNativeDismissBackPressCallback)
    }

    internal fun destroy() {
        dialog.nativeDismissInterceptor = null
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

    override fun handleGestureEnd(dispatchGestureCompleted: () -> Boolean): Boolean {
        val controller = behaviorController
        if (!shouldPreventDismiss || controller == null) {
            return dispatchGestureCompleted()
        }

        // Releasing the drag with hiding disabled makes the sheet snap back right away, instead of sliding
        // off screen first and being restored after the cancel request.
        val isDismissAttempt = controller.isDraggedBelowLowestDetent
        val handled = controller.withHidingDisabled(dispatchGestureCompleted)
        if (isDismissAttempt) {
            // Without hiding, Material settles at the nearest offset, which isn't a detent for single-detent sheets.
            controller.settleAtLastStableState()
            onDismissPrevented()
        }
        return handled
    }
}
