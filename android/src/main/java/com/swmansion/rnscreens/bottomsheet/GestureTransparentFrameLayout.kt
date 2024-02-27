package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import android.util.Log
import android.view.WindowInsets
import android.view.animation.Animation
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView

class GestureTransparentFrameLayout(context: Context) : FrameLayout(context), ReactPointerEventsView {

    override fun onApplyWindowInsets(insets: WindowInsets?): WindowInsets {
        Log.w(DimmingView.TAG, "onApplyWindowInsets")
        return super.onApplyWindowInsets(insets)
    }


    override fun getPointerEvents(): PointerEvents {
        return PointerEvents.BOX_NONE
    }

    override fun startAnimation(animation: Animation?) {
        super.startAnimation(animation)
    }

    companion object {
        const val TAG = "GestureTransparentFrameLayout"
    }
}
