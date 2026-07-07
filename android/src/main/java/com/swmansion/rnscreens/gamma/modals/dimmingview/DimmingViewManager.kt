package com.swmansion.rnscreens.gamma.modals.dimmingview

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog

class DimmingViewManager(
    context: Context,
    private val dialog: BottomSheetDialog,
) {
    // TODO: @t0maboro - consider exposing as a prop
    internal val maxAlpha: Float = MAX_ALPHA

    internal var dimmingViewAlpha: Float
        get() = dimmingView.alpha
        set(value) {
            dimmingView.alpha = value
        }

    private val dimmingView =
        DimmingView(context, initialAlpha = 0f).apply {
            layoutParams =
                CoordinatorLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
        }

    internal fun setOnBackdropClickListener(listener: View.OnClickListener?) {
        dimmingView.setOnClickListener(listener)
    }

    internal fun onDialogShow() {
        attachDimmingViewOverNativeTouchOutside()
    }

    internal fun attachToBehavior(behavior: BottomSheetBehavior<*>) {
        behavior.addBottomSheetCallback(
            object : BottomSheetBehavior.BottomSheetCallback() {
                override fun onStateChanged(
                    bottomSheet: View,
                    newState: Int,
                ) = Unit

                override fun onSlide(
                    bottomSheet: View,
                    slideOffset: Float,
                ) {
                    val fraction = if (slideOffset >= 0) 1f else 1f + slideOffset
                    dimmingView.alpha = fraction * maxAlpha
                }
            },
        )
    }

    private fun attachDimmingViewOverNativeTouchOutside() {
        val coordinator = dialog.findViewById<CoordinatorLayout>(com.google.android.material.R.id.coordinator)
        val bottomSheetView = dialog.findViewById<View>(com.google.android.material.R.id.design_bottom_sheet)

        if (coordinator != null && dimmingView.parent == null && bottomSheetView != null) {
            val sheetIndex = coordinator.indexOfChild(bottomSheetView)
            if (sheetIndex >= 0) {
                coordinator.addView(dimmingView, sheetIndex)
            } else {
                Log.e(TAG, "[RNScreens] BottomSheetView not found! Falling back to bottom index.")
                coordinator.addView(dimmingView, 0)
            }
        }
    }

    companion object {
        const val TAG = "DimmingViewManager"

        private const val MAX_ALPHA = 0.3f
    }
}
