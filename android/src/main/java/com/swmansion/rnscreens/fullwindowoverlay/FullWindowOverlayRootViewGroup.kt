package com.swmansion.rnscreens.fullwindowoverlay

import android.annotation.SuppressLint
import android.content.Context
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import kotlin.math.abs

class FullWindowOverlayRootViewGroup(
    context: Context?,
    private val parentViewGroup: FullWindowOverlay,
) : ReactViewGroup(context),
    RootView,
    ReactPointerEventsView {
    internal var stateWrapper: StateWrapper? = null

    private var hasAdjustedSize = false
    private var viewWidth = 0
    private var viewHeight = 0
    private val jsTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
    internal var eventDispatcher: EventDispatcher? = null
    private var jSPointerDispatcher: JSPointerDispatcher? = null

    private val reactContext: ThemedReactContext
        get() = context as ThemedReactContext

    init {
        if (ReactFeatureFlags.dispatchPointerEvents) {
            jSPointerDispatcher = JSPointerDispatcher(parentViewGroup)
        }
        @SuppressLint("ResourceType")
        id = 42
    }

    override fun onSizeChanged(
        w: Int,
        h: Int,
        oldw: Int,
        oldh: Int,
    ) {
        super.onSizeChanged(w, h, oldw, oldh)
        viewWidth = w
        viewHeight = h
        updateFirstChildView()
    }

    private fun updateFirstChildView() {
        if (childCount > 0) {
            hasAdjustedSize = false
            val viewTag: Int = getChildAt(0).id
            if (stateWrapper != null) {
                // This will only be called under Fabric
                updateState(viewWidth, viewHeight)
            } else {
                // TODO: T44725185 remove after full migration to Fabric
                val reactContext: ReactContext = reactContext
                reactContext.runOnNativeModulesQueueThread(
                    object : GuardedRunnable(reactContext) {
                        override fun runGuarded() {
                            this@FullWindowOverlayRootViewGroup
                                .reactContext.reactApplicationContext
                                .getNativeModule(UIManagerModule::class.java)
                                ?.updateNodeSize(viewTag, viewWidth, viewHeight)
                        }
                    },
                )
            }
        } else {
            hasAdjustedSize = true
        }
    }

    @UiThread
    public fun updateState(
        width: Int,
        height: Int,
    ) {
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        val currentState: ReadableMap? = stateWrapper?.getStateData()
        if (currentState != null) {
            val delta = 0.9f
            val stateScreenHeight =
                if (currentState.hasKey("screenHeight")) {
                    currentState.getDouble("screenHeight").toFloat()
                } else {
                    0f
                }
            val stateScreenWidth =
                if (currentState.hasKey("screenWidth")) {
                    currentState.getDouble("screenWidth").toFloat()
                } else {
                    0f
                }

            if (abs((stateScreenWidth - realWidth).toDouble()) < delta &&
                abs((stateScreenHeight - realHeight).toDouble()) < delta
            ) {
                return
            }
        }

        stateWrapper?.let { sw ->
            val newStateData: WritableMap = WritableNativeMap()
            newStateData.putDouble("screenWidth", realWidth.toDouble())
            newStateData.putDouble("screenHeight", realHeight.toDouble())
            sw.updateState(newStateData)
        }
    }

    override fun addView(
        child: View,
        index: Int,
        params: LayoutParams,
    ) {
        super.addView(child, index, params)
        if (hasAdjustedSize) {
            updateFirstChildView()
        }
    }

    override fun handleException(t: Throwable) {
        reactContext.reactApplicationContext.handleException(RuntimeException(t))
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
//        var rootView: View? = parentViewGroup
//
//        while (rootView != null && !(rootView is RootView)) {
//            rootView = rootView.parent as? View
//        }
//
//        if (rootView != null) {
//            var result = (rootView as ViewGroup).onInterceptTouchEvent(event)
//        }


        eventDispatcher?.let { eventDispatcher ->
            jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
            jSPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        }

        return  super.onInterceptTouchEvent(event)
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        var rootView: View? = parentViewGroup.getCurrentRootView()

        if (rootView != null) {
            (rootView as ViewGroup).dispatchTouchEvent(event)
        }


//        eventDispatcher?.let { eventDispatcher ->
//            jsTouchDispatcher.handleTouchEvent(event, eventDispatcher)
//            jSPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
//        }

        // In case when there is no children interested in handling touch event, we return true from
        // the root view in order to receive subsequent events related to that gesture
        return super.onTouchEvent(event)
    }

    // TODO: Zapytaćw GH czy i jeśli tak to jak to robić
    override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { jSPointerDispatcher?.handleMotionEvent(event, it, true) }
        return super.onHoverEvent(event)
    }

    override fun onHoverEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { jSPointerDispatcher?.handleMotionEvent(event, it, false) }
        return super.onHoverEvent(event)
    }

    override fun onChildStartedNativeGesture(
        childView: View,
        ev: MotionEvent,
    ) {
        eventDispatcher?.let { eventDispatcher ->
            jsTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher)
            jSPointerDispatcher?.onChildStartedNativeGesture(childView, ev, eventDispatcher)
        }
    }

    override fun onChildEndedNativeGesture(
        childView: View,
        ev: MotionEvent,
    ) {
        eventDispatcher?.let { jsTouchDispatcher.onChildEndedNativeGesture(ev, it) }
        jSPointerDispatcher?.onChildEndedNativeGesture()
    }

    override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
        // No-op - override in order to still receive events to onInterceptTouchEvent
        // even when some other view disallow that
    }
}