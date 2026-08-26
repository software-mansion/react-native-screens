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
import com.swmansion.rnscreens.modals.formsheet.native.model.FormSheetDetents
import kotlin.math.roundToInt

internal class FormSheetDimmingManager(
    private val context: Context,
) {
    // TODO: @t0maboro - consider exposing as a prop
    internal val maxAlpha: Float = MAX_DIMMING_ALPHA_FRACTION

    internal var isTransitionAnimationRunning: Boolean = false

    private var sheetView: View? = null

    private var detentsCount: Int = 1
    private var largestUndimmedDetentIndex: Int = FormSheetDetents.ALWAYS_DIMMED_DETENT_INDEX
    private var presentationDetentIndex: Int = 0

    // The resting alpha of the detent the sheet is presented at. Used as the target of the enter transition.
    internal val presentationTargetAlpha: Float
        get() = if (presentationDetentIndex > largestUndimmedDetentIndex) maxAlpha else 0f

    // The drawable rendering this sheet's dimming, added to the overlay of dimmingHost which is
    // Material's `design_bottom_sheet` component or the DecorView of the main application content.
    private var dimmingDrawable: ColorDrawable? = null
    private var dimmingHost: View? = null

    private val dimmingHostLayoutListener =
        View.OnLayoutChangeListener { view, _, _, _, _, _, _, _, _ ->
            dimmingDrawable?.setBounds(0, 0, view.width, view.height)
        }

    private val bottomSheetCallback =
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

                updateDimmingForSheetPosition()
            }
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

    internal fun attachToSheet(view: View) {
        sheetView = view
        BottomSheetBehavior.from(view).addBottomSheetCallback(bottomSheetCallback)
    }

    internal fun detachFromSheet() {
        sheetView?.let {
            BottomSheetBehavior.from(it).removeBottomSheetCallback(bottomSheetCallback)
        }
        sheetView = null
    }

    internal fun updateDimmingProfile(
        detents: FormSheetDetents,
        largestUndimmedDetentIndex: Int,
        initialDetentIndex: Int,
    ) {
        detentsCount = detents.count
        this.largestUndimmedDetentIndex = detents.resolveLargestUndimmedDetentIndex(largestUndimmedDetentIndex)
        presentationDetentIndex = detents.resolveDetentIndex(initialDetentIndex)

        if (isTransitionAnimationRunning) {
            return
        }

        updateDimmingForSheetPosition()
    }

    // Renders the dimming matching the current position of the attached sheet.
    private fun updateDimmingForSheetPosition() {
        val sheetView = sheetView ?: return
        if (!sheetView.isLaidOut) {
            return
        }

        dimmingAlpha = dimmingProgress(sheetView) * maxAlpha
    }

    /**
     * Dimming progress (0..1) for the laid-out [sheetView]. The dimming grows linearly between the resting
     * position of the largest undimmed detent and the resting position of the next detent (the first dimmed).
     */
    private fun dimmingProgress(sheetView: View): Float {
        if (largestUndimmedDetentIndex >= detentsCount - 1) {
            return 0f
        }

        // Material positions the sheet relative to its parent (CoordinatorLayout)
        // the same space the behavior is configured against in FormSheetBehaviorController.
        val sheetAvailableSpace = (sheetView.parent as View).height
        val undimmedTop = restingTopForDetentIndex(largestUndimmedDetentIndex, sheetView, sheetAvailableSpace)
        val dimmedTop = restingTopForDetentIndex(largestUndimmedDetentIndex + 1, sheetView, sheetAvailableSpace)
        if (undimmedTop <= dimmedTop) {
            return if (sheetView.top <= dimmedTop) 1f else 0f
        }

        return ((undimmedTop - sheetView.top).toFloat() / (undimmedTop - dimmedTop)).coerceIn(0f, 1f)
    }

    private fun restingTopForDetentIndex(
        index: Int,
        sheetView: View,
        sheetAvailableSpace: Int,
    ): Int {
        val sheetBehavior = BottomSheetBehavior.from(sheetView)
        return when {
            index < 0 -> sheetAvailableSpace
            index >= detentsCount - 1 -> sheetBehavior.expandedOffset
            index == 0 -> {
                // Material extends the peek height by the bottom system inset it pads the sheet
                // with (see BottomSheetBehavior.calculatePeekHeight), so the collapsed sheet keeps
                // `peekHeight` of content above the inset.
                val insetExtendedPeekHeight = sheetBehavior.peekHeight + sheetView.paddingBottom
                maxOf(sheetAvailableSpace - insetExtendedPeekHeight, sheetBehavior.expandedOffset)
            }
            else -> (sheetAvailableSpace * (1 - sheetBehavior.halfExpandedRatio)).toInt()
        }
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
