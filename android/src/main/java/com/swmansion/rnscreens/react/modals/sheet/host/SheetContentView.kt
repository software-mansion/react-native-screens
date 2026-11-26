package com.swmansion.rnscreens.react.modals.sheet.host

import android.annotation.SuppressLint
import android.content.Context
import android.view.MotionEvent
import android.view.View
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetContentSizeChangeDelegate
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetContentSizeChangeProvider

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor")
class SheetContentView(
    context: Context,
    private val onSizeChangedCallback: (width: Int, height: Int) -> Unit,
) : ReactViewGroup(context),
    RootView {
    internal var contentSizeChangeDelegate: SheetContentSizeChangeDelegate? = null

    private val themedReactContext: ThemedReactContext
        get() = context as ThemedReactContext
    private val jsTouchDispatcher = JSTouchDispatcher(this)
    private var jsPointerDispatcher: JSPointerDispatcher? = null

    private val eventDispatcher: EventDispatcher?
        get() = UIManagerHelper.getEventDispatcher(themedReactContext, UIManagerType.FABRIC)

    init {
        if (ReactFeatureFlags.dispatchPointerEvents) {
            jsPointerDispatcher = JSPointerDispatcher(this)
        }
    }

    override fun onViewAdded(child: View) {
        super.onViewAdded(child)
        (child as? SheetContentSizeChangeProvider)?.setContentSizeChangeDelegate(contentSizeChangeDelegate)
    }

    override fun onViewRemoved(child: View) {
        super.onViewRemoved(child)
        (child as? SheetContentSizeChangeProvider)?.setContentSizeChangeDelegate(null)
    }

    override fun onSizeChanged(
        w: Int,
        h: Int,
        oldw: Int,
        oldh: Int,
    ) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w != oldw || h != oldh) {
            onSizeChangedCallback(w, h)
        }
    }

    override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { eventDispatcher ->
            jsTouchDispatcher.handleTouchEvent(event, eventDispatcher, themedReactContext)
            jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, true)
        }
        return super.onInterceptTouchEvent(event)
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { eventDispatcher ->
            jsTouchDispatcher.handleTouchEvent(event, eventDispatcher, themedReactContext)
            jsPointerDispatcher?.handleMotionEvent(event, eventDispatcher, false)
        }
        super.onTouchEvent(event)
        // In case when there is no children interested in handling touch event, we return true from
        // the root view in order to receive subsequent events related to that gesture
        return true
    }

    override fun onInterceptHoverEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { jsPointerDispatcher?.handleMotionEvent(event, it, true) }
        return super.onInterceptHoverEvent(event)
    }

    override fun onHoverEvent(event: MotionEvent): Boolean {
        eventDispatcher?.let { jsPointerDispatcher?.handleMotionEvent(event, it, false) }
        return super.onHoverEvent(event)
    }

    override fun onChildStartedNativeGesture(
        childView: View?,
        ev: MotionEvent,
    ) {
        eventDispatcher?.let { eventDispatcher ->
            jsTouchDispatcher.onChildStartedNativeGesture(ev, eventDispatcher, themedReactContext)
            jsPointerDispatcher?.onChildStartedNativeGesture(childView, ev, eventDispatcher)
        }
    }

    override fun onChildEndedNativeGesture(
        childView: View,
        ev: MotionEvent,
    ) {
        eventDispatcher?.let { jsTouchDispatcher.onChildEndedNativeGesture(ev, it) }
        jsPointerDispatcher?.onChildEndedNativeGesture()
    }

    override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
        // No-op - override in order to still receive events to onInterceptTouchEvent
        // even when some other view disallow that
    }

    override fun handleException(t: Throwable) {
        themedReactContext.reactApplicationContext.handleException(RuntimeException(t))
    }
}
