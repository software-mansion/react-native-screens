package com.swmansion.rnscreens

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class ContentScrollViewDetector(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext) {
    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
    }
}
