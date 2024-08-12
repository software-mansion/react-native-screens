package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.PixelFormat
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.ViewStructure
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import androidx.annotation.UiThread
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.utils.WindowOverlayCompat
import kotlin.math.abs

class FullWindowOverlay(
    context: ReactContext?,
) : ViewGroup(context) {
    private val mWindowManager: WindowManager =
        context?.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    private var hostView: FullWindowOverlayRootViewGroup = FullWindowOverlayRootViewGroup(context)

    public var stateWrapper: StateWrapper?
        get() = hostView.stateWrapper
        public set(stateWrapper) {
            hostView.stateWrapper = stateWrapper
        }

    public var eventDispatcher: EventDispatcher?
        get() = hostView.eventDispatcher
        public set(eventDispatcher) {
            hostView.eventDispatcher = eventDispatcher
        }

    init {
        val params =
            WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowOverlayCompat.TYPE_SYSTEM_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT,
            )
        mWindowManager.addView(hostView, params)
    }

    protected override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        // Do nothing as we are laid out by UIManager
    }

    public override fun addView(
        child: View?,
        index: Int,
    ) {
        UiThreadUtil.assertOnUiThread()
        hostView.addView(child, index)
    }

    public override fun getChildCount(): Int = hostView.childCount

    public override fun getChildAt(index: Int): View? = hostView.getChildAt(index)

    public override fun removeView(child: View?) {
        UiThreadUtil.assertOnUiThread()

        if (child != null) {
            hostView.removeView(child)
        }
    }

    public override fun removeViewAt(index: Int) {
        UiThreadUtil.assertOnUiThread()
        val child = getChildAt(index)
        hostView.removeView(child)
    }

    public override fun dispatchPopulateAccessibilityEvent(event: AccessibilityEvent): Boolean = false

    public fun onDropInstance() {
        super.invalidate()
        mWindowManager.removeView(hostView)
    }

    public override fun dispatchProvideStructure(structure: ViewStructure) {
        hostView.dispatchProvideStructure(structure)
    }

    /**
     * DialogRootViewGroup is the ViewGroup which contains all the children of a Modal. It gets all
     * child information forwarded from [ReactModalHostView] and uses that to create children. It is
     * also responsible for acting as a RootView and handling touch events. It does this the same way
     * as ReactRootView.
     *
     * To get layout to work properly, we need to layout all the elements within the Modal as if they
     * can fill the entire window. To do that, we need to explicitly set the styleWidth and
     * styleHeight on the LayoutShadowNode to be the window size. This is done through the
     * UIManagerModule, and will then cause the children to layout as if they can fill the window.
     */
    public inner class FullWindowOverlayRootViewGroup(
        context: Context?,
    ) : ReactViewGroup(context),
        RootView {
        internal var stateWrapper: StateWrapper? = null

        private var hasAdjustedSize = false
        private var viewWidth = 0
        private var viewHeight = 0
        private val jSTouchDispatcher: JSTouchDispatcher = JSTouchDispatcher(this)
        private var jSPointerDispatcher: JSPointerDispatcher? = null
        internal var eventDispatcher: EventDispatcher? = null

        private val reactContext: ThemedReactContext
            get() = context as ThemedReactContext

        init {
            if (ReactFeatureFlags.dispatchPointerEvents) {
                jSPointerDispatcher = JSPointerDispatcher(this)
            }
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
            eventDispatcher?.let { eventDispatcher ->
                jSTouchDispatcher.handleTouchEvent(event, eventDispatcher)
                jSPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
            }
            return super.onInterceptTouchEvent(event)
        }

        @SuppressLint("ClickableViewAccessibility")
        override fun onTouchEvent(event: MotionEvent): Boolean {
            eventDispatcher?.let { eventDispatcher ->
                jSTouchDispatcher.handleTouchEvent(event, eventDispatcher)
                jSPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
            }
            super.onTouchEvent(event)
            // In case when there is no children interested in handling touch event, we return true from
            // the root view in order to receive subsequent events related to that gesture
            return true
        }

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
                jSTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher)
                jSPointerDispatcher?.onChildStartedNativeGesture(childView, ev, eventDispatcher)
            }
        }

        override fun onChildEndedNativeGesture(
            childView: View,
            ev: MotionEvent,
        ) {
            eventDispatcher?.let { jSTouchDispatcher.onChildEndedNativeGesture(ev, it) }
            jSPointerDispatcher?.onChildEndedNativeGesture()
        }

        override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
            // No-op - override in order to still receive events to onInterceptTouchEvent
            // even when some other view disallow that
        }
    }
}
