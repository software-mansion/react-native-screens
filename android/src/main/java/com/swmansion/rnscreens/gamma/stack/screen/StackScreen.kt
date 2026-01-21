package com.swmansion.rnscreens.gamma.stack.screen

import android.annotation.SuppressLint
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext

@SuppressLint("ViewConstructor") // should never be restored
class StackScreen(private val reactContext: ThemedReactContext) : ViewGroup(reactContext) {
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    }
}
