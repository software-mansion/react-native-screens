package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class ScrollViewWrapper(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext) {
    override fun onAttachedToWindow() {
        Log.d("SCREENS", "ScrollViewWrapper")
        super.onAttachedToWindow()
    }
}