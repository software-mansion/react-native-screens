package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import kotlin.math.max

@SuppressLint("ViewConstructor")
class ScreenFooter(reactContext: ReactContext) : ReactViewGroup(reactContext) {
    private var lastContainerHeight: Int = 0;
    private var lastStableSheetState: Int = BottomSheetBehavior.STATE_HIDDEN;

    private val screenParent
        get() = requireNotNull(parent as? Screen)

    private val sheetBehavior
        get() = requireNotNull(screenParent.sheetBehavior)

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    private var footerCallback = object : BottomSheetCallback() {
        fun isStateStable(state: Int): Boolean = when (state) {
            BottomSheetBehavior.STATE_HIDDEN,
            BottomSheetBehavior.STATE_EXPANDED,
            BottomSheetBehavior.STATE_COLLAPSED,
            BottomSheetBehavior.STATE_HALF_EXPANDED -> true
            else -> false
        }

        override fun onStateChanged(bottomSheet: View, newState: Int) {
            if (!isStateStable(newState)) {
                return
            }

            when (newState) {
                BottomSheetBehavior.STATE_COLLAPSED,
                BottomSheetBehavior.STATE_HALF_EXPANDED,
                BottomSheetBehavior.STATE_EXPANDED -> layoutFooterOnYAxis(lastContainerHeight, measuredHeight, sheetTopInStableState(newState))
                else -> {}
            }
            lastStableSheetState = newState
        }

        override fun onSlide(bottomSheet: View, slideOffset: Float) {

//            this@ScreenFooter.top = lastContainerHeight!! - (0 + measuredHeight + paddingBottom)
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        screenParent.sheetBehavior?.addBottomSheetCallback(footerCallback)
    }

    private fun sheetTopInStableState(state: Int): Int {
        val retval = when (state) {
            BottomSheetBehavior.STATE_COLLAPSED -> lastContainerHeight - sheetBehavior.peekHeight
            BottomSheetBehavior.STATE_HALF_EXPANDED -> (lastContainerHeight * (1 - sheetBehavior.halfExpandedRatio)).toInt()
            BottomSheetBehavior.STATE_EXPANDED -> sheetBehavior.expandedOffset
            BottomSheetBehavior.STATE_HIDDEN -> lastContainerHeight
            else -> throw IllegalArgumentException("[RNSScreen] use of stable-state method for unstable state")
        }
        return retval
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
            "onParentLayout  t: $top, b: $bottom, ch: $containerHeight, mh: ${measuredHeight}, top: ${this.top}"
        )
    }

    fun layoutFooterOnYAxis(containerHeight: Int, footerHeight: Int, sheetTop: Int) {
        val newTop = containerHeight - footerHeight - sheetTop
        this.top = max(newTop, 0)
        if (childCount > 0) {
            this.bottom = this.top + getChildAt(0).height
        }
    }
}
