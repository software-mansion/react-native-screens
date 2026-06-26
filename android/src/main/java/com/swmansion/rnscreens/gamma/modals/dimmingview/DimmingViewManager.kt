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
    private val dimmingView: DimmingView = createDimmingView(context)
    internal val maxAlpha: Float = 0.3f

    internal val currentAlpha: Float
        get() = dimmingView.alpha

    internal fun updateAlpha(currentAlpha: Float) {
        dimmingView.alpha = currentAlpha
    }

    private fun createDimmingView(context: Context): DimmingView =
        DimmingView(context, maxAlpha).apply {
            layoutParams =
                CoordinatorLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
            alpha = 0f
            fitsSystemWindows = false

            setOnClickListener {
                onCloseRequested()
            }
        }

    internal fun onShow() {
        val coordinator = dialog.findViewById<CoordinatorLayout>(com.google.android.material.R.id.coordinator)

        if (coordinator != null && dimmingView.parent == null) {
            coordinator.addView(dimmingView, 0)
        }
    }

    internal fun attachToBehavior(behavior: BottomSheetBehavior<*>) {
        behavior.addBottomSheetCallback(
            object : BottomSheetBehavior.BottomSheetCallback() {
                override fun onStateChanged(
                    bottomSheet: View,
                    newState: Int,
                ) {
                    // TODO: @t0maboro - it should be placed in some FormSheetAnimator/Behavior class
                    if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                        dimmingView.animate().cancel()
                        dimmingView
                            .animate()
                            .alpha(0f)
                            .setDuration(250)
                            .start()
                    }
                }

                override fun onSlide(
                    bottomSheet: View,
                    slideOffset: Float,
                ) {
                    dimmingView.animate().cancel()
                    val fraction = if (slideOffset >= 0) 1f else 1f + slideOffset
                    dimmingView.alpha = fraction * maxAlpha
                }
            },
        )
    }
}
