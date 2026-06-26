package com.swmansion.rnscreens.gamma.modals.dimmingview

import android.content.Context
import android.view.View
import android.view.ViewGroup
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog

class DimmingViewManager(
    context: Context,
    private val dialog: BottomSheetDialog,
    private val onCloseRequested: () -> Unit,
) {
    // TODO: @t0maboro - consider exposing as a prop
    internal val maxAlpha: Float = 0.3f

    internal var dimmingViewAlpha: Float
        get() = dimmingView.alpha
        set(value) {
            dimmingView.alpha = value
        }

    private val dimmingView =
        DimmingView(context, maxAlpha).apply {
            layoutParams =
                CoordinatorLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
            alpha = 0f

            setOnClickListener {
                onCloseRequested()
            }
        }

    internal fun onDialogShown() {
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
            coordinator.addView(dimmingView, sheetIndex)
        }
    }
}
