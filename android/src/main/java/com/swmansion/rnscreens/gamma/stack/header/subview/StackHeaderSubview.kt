package com.swmansion.rnscreens.gamma.stack.header.subview

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class StackHeaderSubview(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext) {
    var type: StackHeaderSubviewType = StackHeaderSubviewType.CENTER

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        super.onLayout(changed, left, top, right, bottom)
    }

    // We want to rely on layout from Yoga instead of native Toolbar layout which tries to stretch
    // subview to match parent.
    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        if (width > 0 && height > 0) {
            setMeasuredDimension(width, height)
        } else {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        }
    }
}
