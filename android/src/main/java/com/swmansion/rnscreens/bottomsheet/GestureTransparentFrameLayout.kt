package com.swmansion.rnscreens.bottomsheet

import android.content.Context
import android.view.animation.Animation
import android.widget.FrameLayout
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView

class GestureTransparentFrameLayout(context: Context) : FrameLayout(context), ReactPointerEventsView {
    override fun getPointerEvents(): PointerEvents {
        return PointerEvents.BOX_NONE
    }

    override fun startAnimation(animation: Animation?) {
        super.startAnimation(animation)
    }
}
