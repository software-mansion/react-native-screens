package com.swmansion.rnscreens

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class ScreenContentWrapper(reactContext: ReactContext) : ReactViewGroup(reactContext) {
    internal var delegate: OnLayoutCallback? = null

    interface OnLayoutCallback {
        fun onLayoutCallback(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int)
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        delegate?.onLayoutCallback(changed, left, top, right, bottom)
    }
}
