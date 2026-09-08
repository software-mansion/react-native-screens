package com.swmansion.rnscreens.modals.formsheet.native.presentation

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.google.android.material.bottomsheet.BottomSheetBehavior
import kotlin.math.roundToInt

internal class FormSheetDimmingManager(
    private val context: Context,
) {
    // TODO: @t0maboro - consider exposing as a prop
    internal val maxAlpha: Float = MAX_DIMMING_ALPHA_FRACTION

    internal var isTransitionAnimationRunning: Boolean = false

    // The drawable rendering this sheet's dimming, added to the overlay of dimmingHost which is
    // Material's `design_bottom_sheet` component or the DecorView of the main application content.
    private var dimmingDrawable: ColorDrawable? = null
    private var dimmingHost: View? = null

    private val dimmingHostLayoutListener =
        View.OnLayoutChangeListener { view, _, _, _, _, _, _, _, _ ->
            dimmingDrawable?.setBounds(0, 0, view.width, view.height)
        }

    internal var dimmingAlpha: Float = 0f
        set(value) {
            field = value
            // We're transforming the value, because View.alpha is within [0.0, 1.0] range,
            // while Drawable.alpha is an Integer in [0, 255] range.
            dimmingDrawable?.alpha = (value * MAX_DRAWABLE_OVERLAY_ALPHA).roundToInt().coerceIn(0, MAX_DRAWABLE_OVERLAY_ALPHA)
        }

    /**
     * Called when the sheet is presented. [belowSheetView] is the `design_bottom_sheet` of the
     * sheet directly below in the stack, or null when this sheet is the bottom-most one - the
     * dimming then goes onto the decor of the activity hosting the sheets.
     */
    internal fun attachDimming(belowSheetView: View?) {
        val host = belowSheetView ?: resolveActivityDecorView()
        if (host == null) {
            Log.e(TAG, "[RNScreens] Neither a sheet below nor an activity decor found; the sheet will present undimmed.")
            return
        }

        dimmingHost = host
        dimmingDrawable =
            ColorDrawable(Color.BLACK).apply {
                alpha = 0
                setBounds(0, 0, host.width, host.height)
            }
        host.overlay.add(dimmingDrawable!!)
        host.addOnLayoutChangeListener(dimmingHostLayoutListener)
    }

    internal fun detachDimming() {
        dimmingHost?.removeOnLayoutChangeListener(dimmingHostLayoutListener)
        dimmingDrawable?.let { dimmingHost?.overlay?.remove(it) }
        dimmingHost = null
        dimmingDrawable = null
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
                    // Prevent system updates from overriding alpha while running custom enter/exit animation.
                    // When initialDetentIndex is snapping to a high detent, BottomSheetBehavior fires onSlide
                    // events that conflict with our manual alpha animator, causing the backdrop to flash.
                    if (isTransitionAnimationRunning) {
                        return
                    }

                    val fraction = if (slideOffset >= 0) 1f else 1f + slideOffset
                    dimmingAlpha = fraction * maxAlpha
                }
            },
        )
    }

    private fun resolveActivityDecorView(): View? {
        var current: Context? = context
        while (current is ContextWrapper) {
            if (current is Activity) {
                return current.window?.decorView
            }
            if (current is ReactContext) {
                return current.currentActivity?.window?.decorView
            }
            current = current.baseContext
        }
        return null
    }

    companion object {
        const val TAG = "FormSheetDimmingManager"

        private const val MAX_DIMMING_ALPHA_FRACTION = 0.3f
        private const val MAX_DRAWABLE_OVERLAY_ALPHA = 255
    }
}
