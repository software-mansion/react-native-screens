package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import kotlin.math.max

@SuppressLint("ViewConstructor")
class ScreenFooter(reactContext: ReactContext) : ReactViewGroup(reactContext) {
    private var lastContainerHeight: Int? = null;

    private val screenParent
        get() = requireNotNull(parent as? Screen)

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    private var footerCallback = object : BottomSheetCallback() {
        override fun onStateChanged(bottomSheet: View, newState: Int) = Unit

        override fun onSlide(bottomSheet: View, slideOffset: Float) {
//            this@ScreenFooter.top = lastContainerHeight!! - (0 + measuredHeight + paddingBottom)
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        screenParent.sheetBehavior?.addBottomSheetCallback(footerCallback)
    }

    fun onParentLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int, containerHeight: Int) {
//        this.top = containerHeight - (0 + measuredHeight + paddingBottom)
        val peekHeight = screenParent.sheetBehavior!!.peekHeight
        val sheetTop = containerHeight - peekHeight
        this.top = max(containerHeight - measuredHeight - sheetTop, 0)
//        this.top = top
        Log.w("ScreenFooter", "onParentLayout  t: $top, b: $bottom, ch: $containerHeight, mh: ${measuredHeight}, top: ${this.top}")
        lastContainerHeight = containerHeight
    }
}
