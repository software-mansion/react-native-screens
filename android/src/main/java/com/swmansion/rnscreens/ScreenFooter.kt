package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class ScreenFooter(reactContext: ReactContext) : ReactViewGroup(reactContext) {
    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    fun onParentLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int, containerHeight: Int) {
        Log.w("ScreenFooter", "onParentLayout $left $top, $right $bottom $containerHeight")
        this.top = containerHeight - (0 + measuredHeight + paddingBottom)
        Log.w("ScreenFooter", "onParentLayout $left $top, $right $bottom $containerHeight")
    }
}
