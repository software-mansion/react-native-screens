package com.swmansion.rnscreens.modals.formsheet

import android.view.View
import androidx.activity.OnBackPressedCallback
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.modals.dimmingview.DimmingViewManager

internal class FormSheetNativeDismissCoordinator(
    private val dialog: FormSheetDialog,
    private val bottomSheetView: View?,
    private val dimmingManager: DimmingViewManager,
    private val onNativeDismiss: () -> Unit,
    private val onNativeDismissPrevented: () -> Unit,
) {
    internal var shouldPreventNativeDismiss: Boolean = false
        set(value) {
            field = value
            backPressedCallback.isEnabled = value
        }

    private val behavior: BottomSheetBehavior<View>? by lazy {
        bottomSheetView?.let { BottomSheetBehavior.from(it) }
    }

    private var lastStableState = BottomSheetBehavior.STATE_COLLAPSED

    private val stateObserver =
        object : BottomSheetBehavior.BottomSheetCallback() {
            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                if (isStableState(newState)) lastStableState = newState
            }

            override fun onSlide(
                bottomSheet: View,
                slideOffset: Float,
            ) = Unit
        }

    private val backPressedCallback =
        object : OnBackPressedCallback(false) {
            override fun handleOnBackPressed() {
                tryPreventDismiss()
            }
        }

    internal fun setup() {
        behavior?.let { behavior ->
            if (isStableState(behavior.state)) lastStableState = behavior.state
            behavior.addBottomSheetCallback(stateObserver)
        }

        dialog.onBackPressedDispatcher.addCallback(backPressedCallback)
        dialog.onPreventDismissRequested = {
            tryPreventDismiss()
        }
        dialog.setOnCancelListener {
            onNativeDismiss()
        }
        dimmingManager.setOnBackdropClickListener {
            dialog.cancel()
        }
    }

    internal fun destroy() {
        behavior?.removeBottomSheetCallback(stateObserver)

        backPressedCallback.remove()
        dialog.onPreventDismissRequested = null
        dialog.setOnCancelListener(null)
        dimmingManager.setOnBackdropClickListener(null)
    }

    private fun tryPreventDismiss(): Boolean {
        if (!shouldPreventNativeDismiss) {
            return false
        }

        onNativeDismissPrevented()

        behavior?.let { behavior ->
            if (behavior.state == BottomSheetBehavior.STATE_HIDDEN) {
                behavior.state = lastStableState
            }
        }
        return true
    }

    private fun isStableState(state: Int): Boolean =
        state == BottomSheetBehavior.STATE_EXPANDED ||
            state == BottomSheetBehavior.STATE_COLLAPSED ||
            state == BottomSheetBehavior.STATE_HALF_EXPANDED
}
