package com.swmansion.rnscreens.fullwindowoverlay

import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.EventDispatcher

class FullWindowOverlayHostView(
    val context: ThemedReactContext,
    val eventDispatcher: EventDispatcher,
    val fakeReactTag: Int,
) : ViewGroup(context),
    RootView {
    init {
        id = fakeReactTag
    }

    private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
    private var jsPointerDispatcher: JSPointerDispatcher? =
        if (ReactFeatureFlags.dispatchPointerEvents) {
            JSPointerDispatcher(this)
        } else {
            null
        }

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        val width = MeasureSpec.getSize(widthMeasureSpec)
        val height = MeasureSpec.getSize(heightMeasureSpec)
        if (isReactOriginatedMeasure(widthMeasureSpec, heightMeasureSpec)) {
//            hostView.measure(widthMeasureSpec, heightMeasureSpec)
            Log.i(TAG, "onMeasure - React $width, $height")
//            hostView.measure(widthMeasureSpec, heightMeasureSpec)
        } else {
            Log.i(TAG, "onMeasure - SYSTEM $width, $height")
        }
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        val width = r - l
        val height = b - t
        Log.i(TAG, "onLayout ($l, $t) ($width, $height)")
    }

    override fun onInterceptTouchEvent(ev: MotionEvent): Boolean {
        jsTouchDispatcher.handleTouchEvent(ev, eventDispatcher, context)
        jsPointerDispatcher?.handleMotionEvent(ev, eventDispatcher, true)
        return super.onInterceptTouchEvent(ev)
    }

    override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        return super.onInterceptHoverEvent(event)
    }

    override fun onHoverEvent(event: MotionEvent): Boolean {
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
        return super.onHoverEvent(event)
    }

    override fun onChildStartedNativeGesture(
        childView: View?,
        ev: MotionEvent,
    ) {
        jsTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher)
        jsPointerDispatcher?.onChildStartedNativeGesture(childView, ev, eventDispatcher)
    }

    override fun onChildEndedNativeGesture(
        childView: View,
        ev: MotionEvent,
    ) {
        jsTouchDispatcher.onChildEndedNativeGesture(ev, eventDispatcher)
        jsPointerDispatcher?.onChildEndedNativeGesture()
    }

    override fun handleException(t: Throwable) {
        context.reactApplicationContext?.handleException(RuntimeException(t))
    }

    private fun isReactOriginatedMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) = MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY &&
        MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY

    companion object {
        const val TAG = "FullWindowOverlayHostView"
    }
}
