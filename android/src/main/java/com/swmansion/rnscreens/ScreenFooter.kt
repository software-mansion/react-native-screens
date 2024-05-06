package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
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
class ScreenFooter(val reactContext: ReactContext) : ReactViewGroup(reactContext) {
    private var lastContainerHeight: Int = 0
    private var lastStableSheetState: Int = STATE_HIDDEN
    private var isAnimationControlledByKeyboard = false
    private var lastSlideOffset = 0.0f
    private var lastBottomInset = 0

    // ScreenFooter is supposed to be direct child of Screen
    private val screenParent
        get() = requireNotNull(parent as? Screen)

    private val sheetBehavior
        get() = requireNotNull(screenParent.sheetBehavior)

    private val insetsAnimation = object : WindowInsetsAnimationCompat.Callback(DISPATCH_MODE_STOP) {
        override fun onPrepare(animation: WindowInsetsAnimationCompat) {
            super.onPrepare(animation)
        }

        override fun onStart(
            animation: WindowInsetsAnimationCompat,
            bounds: WindowInsetsAnimationCompat.BoundsCompat
        ): WindowInsetsAnimationCompat.BoundsCompat {
            isAnimationControlledByKeyboard = true
            return super.onStart(animation, bounds)
        }

        override fun onProgress(
            insets: WindowInsetsCompat,
            runningAnimations: MutableList<WindowInsetsAnimationCompat>
        ): WindowInsetsCompat {
            val isImeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
            val imeBottomInset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
            lastBottomInset = imeBottomInset

//            Log.i("ScreenFooter", "onProgress $isImeVisible $imeBottomInset")
            layoutFooterOnYAxis(lastContainerHeight, measuredHeight, sheetTopWhileDragging(lastSlideOffset), imeBottomInset)
            return insets
        }

        override fun onEnd(animation: WindowInsetsAnimationCompat) {
            isAnimationControlledByKeyboard = false
        }
    }

    init {
        val rootView = reactContext.currentActivity!!.window.decorView
        ViewCompat.setWindowInsetsAnimationCallback(rootView!!, insetsAnimation)
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
//        Log.i(TAG, "onLayout")
        layoutFooterOnYAxis(lastContainerHeight, bottom - top, sheetTopInStableState(sheetBehavior.state), lastBottomInset)
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
//            Log.i(TAG, "onStateChanged")

            when (newState) {
                STATE_COLLAPSED,
                STATE_HALF_EXPANDED,
                STATE_EXPANDED -> layoutFooterOnYAxis(lastContainerHeight, measuredHeight, sheetTopInStableState(newState), lastBottomInset)
                else -> {}
            }
            lastStableSheetState = newState
        }

        override fun onSlide(bottomSheet: View, slideOffset: Float) {
//            Log.i(TAG, "onSlide $slideOffset")
            lastSlideOffset = slideOffset
            if (!isAnimationControlledByKeyboard) {
                layoutFooterOnYAxis(lastContainerHeight, measuredHeight, sheetTopWhileDragging(slideOffset), lastBottomInset)
            }
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
    }

    /**
     * Layouts this component within parent screen. It takes care only of vertical axis, leaving
     * horizontal axis solely for React to handle.
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
    fun layoutFooterOnYAxis(containerHeight: Int, footerHeight: Int, sheetTop: Int, bottomInset: Int = 0) {
        val newTop = containerHeight - footerHeight - sheetTop - bottomInset
        val heightBeforeUpdate = this.measuredHeight
        this.top = max(newTop, 0)
        this.bottom = this.top + heightBeforeUpdate

//        Log.i("ScreenFooter", "Layout cH: $containerHeight, fH: $footerHeight, sT: $sheetTop, bI: $bottomInset -> top: $top")
    }

    companion object {
        const val TAG = "ScreenFooter"
    }
}
