package com.swmansion.rnscreens.bottomsheet

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.view.MotionEvent
import android.view.ViewGroup
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactCompoundViewGroup
import com.facebook.react.uimanager.ReactPointerEventsView

@SuppressLint("ViewConstructor")  // Only we instantiate this view
class DimmingView(context: Context, initialAlpha: Float = 0.6F) : ViewGroup(context), ReactCompoundViewGroup, ReactPointerEventsView {
    private var blockGestures = initialAlpha > 0F

    init {
        setBackgroundColor(Color.BLACK)
        alpha = initialAlpha
    }

    override fun setAlpha(alpha: Float) {
        super.setAlpha(alpha)
        blockGestures = alpha > 0F
    }

    // This view group is not supposed to have any children, however we need it to be a view group
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) = Unit

    override fun onTouchEvent(event: MotionEvent?): Boolean {

        return blockGestures
    }

    override fun onInterceptTouchEvent(ev: MotionEvent?): Boolean {
        return super.onInterceptTouchEvent(ev)
    }

    override fun reactTagForTouch(p0: Float, p1: Float): Int {
        throw IllegalStateException("$TAG should never be asked for the view tag")
    }

    override fun interceptsTouchEvent(p0: Float, p1: Float) = blockGestures

    companion object {
        const val TAG = "DimmingView"
    }

    override fun getPointerEvents(): PointerEvents = if (blockGestures) PointerEvents.AUTO else PointerEvents.NONE
}