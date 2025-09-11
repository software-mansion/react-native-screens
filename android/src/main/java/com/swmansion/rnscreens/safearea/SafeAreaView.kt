package com.swmansion.rnscreens.safearea

import android.annotation.SuppressLint
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor") // Should never be recreated
class SafeAreaView(
    private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext) {
    companion object {
        const val TAG = "SafeAreaView"
    }
}
