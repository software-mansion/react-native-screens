package com.swmansion.rnscreens.fullwindowoverlay

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
    fwoComponentTag: Int,
) : ViewGroup(context),
    RootView {
    init {
        // Needed for the safe of react-native's gesture handling. It looks through parent view chain looking
        // for "parent" during multiple operations. It recognizes the parent as "react owned" one,
        // by verifying that its `id > 0`. We take the tag from the FWO component from the main subtree.
        id = fwoComponentTag
    }

    private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
    private var jsPointerDispatcher: JSPointerDispatcher? =
        if (ReactFeatureFlags.dispatchPointerEvents) {
            JSPointerDispatcher(this)
        } else {
            null
        }

    // Do nothing
    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

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
