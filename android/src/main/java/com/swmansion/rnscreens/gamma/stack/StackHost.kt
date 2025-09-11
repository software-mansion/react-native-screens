package com.swmansion.rnscreens.gamma.stack

import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext

class StackHost(private val reactContext: ThemedReactContext) : ViewGroup(reactContext) {
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) = Unit
}
