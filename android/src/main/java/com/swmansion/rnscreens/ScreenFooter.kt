package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_COLLAPSED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HALF_EXPANDED
import com.google.android.material.bottomsheet.BottomSheetBehavior.STATE_HIDDEN
import com.google.android.material.math.MathUtils
import kotlin.math.max

@SuppressLint("ViewConstructor")
class ScreenFooter(reactContext: ReactContext) : ReactViewGroup(reactContext) {
    private var lastContainerHeight: Int = 0
    private var lastStableSheetState: Int = STATE_HIDDEN

    // ScreenFooter is supposed to be direct child of Screen
    private val screenParent
        get() = requireNotNull(parent as? Screen)

    private val sheetBehavior
        get() = requireNotNull(screenParent.sheetBehavior)

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        layoutFooterOnYAxis(lastContainerHeight, bottom - top, sheetTopInStableState(sheetBehavior.state))
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    private var footerCallback = object : BottomSheetCallback() {
        fun isStateStable(state: Int): Boolean = when (state) {
            STATE_HIDDEN,
            STATE_EXPANDED,
            STATE_COLLAPSED,
            STATE_HALF_EXPANDED -> true
            else -> false
        }

        override fun onStateChanged(bottomSheet: View, newState: Int) {
            if (!isStateStable(newState)) {
                return
            }

            when (newState) {
                STATE_COLLAPSED,
                STATE_HALF_EXPANDED,
                STATE_EXPANDED -> layoutFooterOnYAxis(lastContainerHeight, measuredHeight, sheetTopInStableState(newState))
                else -> {}
            }
            lastStableSheetState = newState
        }

        override fun onSlide(bottomSheet: View, slideOffset: Float) {
            layoutFooterOnYAxis(lastContainerHeight, measuredHeight, sheetTopWhileDragging(slideOffset))
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        // TODO: Find a place to remove this callback?
        // Maybe add / remove it in ScreenViewManager rather than here
        screenParent.sheetBehavior?.addBottomSheetCallback(footerCallback)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        screenParent.sheetBehavior?.removeBottomSheetCallback(footerCallback)
    }

    private fun sheetTopInStableState(state: Int): Int {
        val retval = when (state) {
            STATE_COLLAPSED -> lastContainerHeight - sheetBehavior.peekHeight
            STATE_HALF_EXPANDED -> (lastContainerHeight * (1 - sheetBehavior.halfExpandedRatio)).toInt()
            STATE_EXPANDED -> sheetBehavior.expandedOffset
            STATE_HIDDEN -> lastContainerHeight
            else -> throw IllegalArgumentException("[RNSScreen] use of stable-state method for unstable state")
        }
        return retval
    }

    private fun sheetTopWhileDragging(slideOffset: Float): Int {
        return MathUtils.lerp(
            sheetTopInStableState(STATE_COLLAPSED).toFloat(),
            sheetTopInStableState(
                STATE_EXPANDED
            ).toFloat(),
            slideOffset
        ).toInt()
    }

    fun onParentLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
        containerHeight: Int
    ) {
        lastContainerHeight = containerHeight
        layoutFooterOnYAxis(containerHeight, measuredHeight, sheetTopInStableState(sheetBehavior.state))

        Log.w(
            "ScreenFooter",
            "onParentLayout  t: $top, b: $bottom, ch: $containerHeight, mh: $measuredHeight, top: ${this.top}"
        )
    }

    /**
     * Layouts this component within parent screen. It takes care only of vertical axis.
     *
     * This is a bit against Android rules, that parents should layout their children,
     * however I wanted to keep this logic away from Screen component to avoid introducing
     * complexity there and have footer logic as much separated as it is possible.
     *
     * Please note that React has no clue about updates enforced in below method.
     *
     * @param containerHeight this should be the height of the screen (sheet) container used
     * to calculate sheet properties when configuring behaviour
     * @param footerHeight summarized height of this component children
     * @param sheetTop current bottom sheet top (Screen top) **relative to container**
     */
    fun layoutFooterOnYAxis(containerHeight: Int, footerHeight: Int, sheetTop: Int) {
        val newTop = containerHeight - footerHeight - sheetTop
        this.top = max(newTop, 0)
        if (childCount > 0) {
            this.bottom = this.top + getChildAt(0).height
        }
    }
}
