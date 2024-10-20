package com.swmansion.rnscreens

import android.content.Context
import android.graphics.PixelFormat
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup

class FullWindowOverlayRootViewGroup(val reactContext: ThemedReactContext): ReactViewGroup(reactContext), RootView {
    internal var eventDispatcher: EventDispatcher? = null

    internal val jSTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
    internal var jSPointerDispatcher: JSPointerDispatcher? = null

    override fun onChildStartedNativeGesture(childView: View, ev: MotionEvent) {
        eventDispatcher?.let {
            jSTouchDispatcher.onChildStartedNativeGesture(ev, it)
            jSPointerDispatcher?.onChildStartedNativeGesture(childView, ev, it)
        }
    }

    override fun onChildEndedNativeGesture(childView: View, ev: MotionEvent) {
        eventDispatcher?.let {
            jSTouchDispatcher.onChildEndedNativeGesture(ev, it)
            jSPointerDispatcher?.onChildEndedNativeGesture()
        }
    }

    override fun handleException(t: Throwable) {
        reactContext.reactApplicationContext.handleException(RuntimeException(t))
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { eventDispatcher ->
            jSTouchDispatcher.handleTouchEvent(event, eventDispatcher)
            jSPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        }
        return super.onInterceptTouchEvent(event)
    }

    fun addToViewHierarchy() {
        val windowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val windowParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION,
            (WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                    or WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                    or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                    or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN),
            PixelFormat.TRANSLUCENT
        )
        windowManager.addView(this, windowParams)
    }
}

class FullWindowOverlay(val reactContext: ThemedReactContext): ReactViewGroup(reactContext) {
    private val fullWindowOverlayRootViewGroup = FullWindowOverlayRootViewGroup(reactContext)

    init {
        fullWindowOverlayRootViewGroup.addToViewHierarchy()
    }

    public var eventDispatcher: EventDispatcher?
        get() = fullWindowOverlayRootViewGroup.eventDispatcher
        public set(eventDispatcher) {
            fullWindowOverlayRootViewGroup.eventDispatcher = eventDispatcher
        }

    public override fun getChildCount(): Int = fullWindowOverlayRootViewGroup.childCount

    public override fun getChildAt(index: Int): View? = fullWindowOverlayRootViewGroup.getChildAt(index)

    override fun addView(child: View?, index: Int) {
        UiThreadUtil.assertOnUiThread()
        fullWindowOverlayRootViewGroup.addView(child, index)
    }

    override fun removeView(child: View?) {
        UiThreadUtil.assertOnUiThread()

        if (child != null) {
            fullWindowOverlayRootViewGroup.removeView(child)
        }
    }

    public override fun removeViewAt(index: Int) {
        UiThreadUtil.assertOnUiThread()
        val child = getChildAt(index)
        fullWindowOverlayRootViewGroup.removeView(child)
    }
}

@ReactModule(name = FullWindowOverlayViewManager.REACT_CLASS)
class FullWindowOverlayViewManager:  ViewGroupManager<FullWindowOverlay>() {
    companion object {
        const val REACT_CLASS = "RNSFullWindowOverlay"
    }

    override fun getName() = FullWindowOverlayViewManager.REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = FullWindowOverlay(reactContext)

    protected override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: FullWindowOverlay
    ) {
        val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, view.id)
        if (dispatcher != null) {
            view.eventDispatcher = dispatcher
        }
    }
}
