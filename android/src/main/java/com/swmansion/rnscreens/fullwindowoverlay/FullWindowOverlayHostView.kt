package com.swmansion.rnscreens.fullwindowoverlay

import android.util.Log
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext

class FullWindowOverlayHostView(context: ThemedReactContext): ViewGroup(context) {
    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int
    ) {
        Log.i(TAG, "onLayout")
    }


    companion object {
        const val TAG = "FullWindowOverlayHostView"
    }
}