package com.swmansion.rnscreens.bottomsheet

import android.annotation.SuppressLint
import android.view.MotionEvent
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class BottomSheetDialogRootView(
    val reactContext: ReactContext?,
    private val eventDispatcher: EventDispatcher,
) : ReactViewGroup(reactContext),
    RootView {
    private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
    private var jsPointerDispatcher: JSPointerDispatcher? = null

    init {
        // Can we safely use ReactFeatureFlags?
        if (ReactFeatureFlags.dispatchPointerEvents) {
            jsPointerDispatcher = JSPointerDispatcher(this)
        }
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        if (changed) {
            // This view is used right now only in ScreenModalFragment, where it is injected
            // to view hierarchy as a parent of a Screen.
            assert(childCount == 1) { "[RNScreens] Expected only a single child view under ${TAG}, received: ${childCount}"}
            getChildAt(0).layout(l, t, r, b)
        }
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        return super.onInterceptTouchEvent(event)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
        super.onTouchEvent(event)
        return true
    }

    override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        // This is how DialogRootViewGroup implements this, it might be a copy-paste mistake
        // on their side.
        return super.onHoverEvent(event)
    }

    override fun onHoverEvent(event: MotionEvent): Boolean {
        jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
        return super.onHoverEvent(event)
    }

    override fun onChildStartedNativeGesture(
        view: View,
        event: MotionEvent,
    ) {
        jsTouchDispatcher.onChildStartedNativeGesture(event, eventDispatcher)
        jsPointerDispatcher?.onChildStartedNativeGesture(view, event, eventDispatcher)
    }

    @Deprecated("Deprecated by React Native")
    override fun onChildStartedNativeGesture(event: MotionEvent): Unit =
        throw IllegalStateException("Deprecated onChildStartedNativeGesture was called")

    override fun onChildEndedNativeGesture(
        view: View,
        event: MotionEvent,
    ) {
        jsTouchDispatcher.onChildEndedNativeGesture(event, eventDispatcher)
        jsPointerDispatcher?.onChildEndedNativeGesture()
    }

    override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
        // We do not pass through request of our child up the view hierarchy, as we
        // need to keep receiving events.
    }

    override fun handleException(throwable: Throwable?) {
        // TODO: I need ThemedReactContext here.
        // TODO: Determine where it is initially created & verify its lifecycle
        //        reactContext?.reactApplicationContext?.handleException(RuntimeException(throwable))
    }

    companion object {
        const val TAG = "BottomSheetDialogRootView"
    }
}
