package com.swmansion.rnscreens.core.modals.sheet.coordinator

import androidx.activity.OnBackPressedCallback
import com.swmansion.rnscreens.core.modals.sheet.dialog.SheetDialog

internal class SheetNativeDismissCoordinator(
    private val dialog: SheetDialog,
    private val behaviorController: SheetBehaviorController?,
    private val onDismissAllowed: () -> Unit,
    private val onDismissPrevented: () -> Unit,
) : SheetDialog.NativeDismissInterceptor {
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
        val wasDraggedBelowLowestDetent = controller.isDraggedBelowLowestDetent
        val handled = controller.withHidingDisabled(dispatchGestureCompleted)
        // A lifted pointer doesn't release the sheet while another one keeps dragging it.
        if (wasDraggedBelowLowestDetent && !controller.isDragging) {
            controller.settleAtLastStableState()
            onDismissPrevented()
        }
        return handled
    }
}
