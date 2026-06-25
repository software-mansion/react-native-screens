package com.swmansion.rnscreens.gamma.modals.dimmingview

import android.content.Context
import android.view.View
import android.view.ViewGroup
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.ReactContext
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog

class DimmingViewManager(
    private val reactContext: ReactContext?,
    private val dialog: BottomSheetDialog,
) {
    private val dimmingView: DimmingView = createDimmingView(reactContext?.baseContext)
    private val maxAlpha: Float = 0.3f

    private fun createDimmingView(context: Context?): DimmingView {
        // TODO: @t0maboro - needs to be changed, we shouldn't attach dimming view to main app window
        val safeContext = context ?: return DimmingView(reactContext as Context, maxAlpha)
        return DimmingView(safeContext, maxAlpha).apply {
            layoutParams =
                CoordinatorLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT,
                )
            alpha = 0f
            fitsSystemWindows = false

            setOnClickListener {
                dialog.cancel()
            }
        }
    }

    internal fun onShow() {
        // TODO: @t0maboro - needs to be changed, we shouldn't attach dimming view to main app window
        val activityDecorView = reactContext?.currentActivity?.window?.decorView as? ViewGroup

        if (activityDecorView != null && dimmingView.parent == null) {
            activityDecorView.addView(dimmingView)
        }

        // TODO: @t0maboro - it should be placed in some FormSheetAnimator class
        dimmingView.animate().cancel()
        dimmingView
            .animate()
            .alpha(maxAlpha)
            .setDuration(250)
            .start()
    }

    internal fun onDismiss() {
        // TODO: @t0maboro - it should be placed in some FormSheetAnimator class
        dimmingView.animate().cancel()
        dimmingView
            .animate()
            .alpha(0f)
            .setDuration(250)
            .start()
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
