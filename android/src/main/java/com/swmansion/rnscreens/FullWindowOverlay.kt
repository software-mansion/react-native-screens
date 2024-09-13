package com.swmansion.rnscreens

import FullWindowOverlayRootViewGroup
import android.content.Context
import android.graphics.PixelFormat
import android.view.View
import android.view.ViewStructure
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.utils.WindowOverlayCompat

// TODO Podebugować ewenty - co gdzie trafia
class FullWindowOverlay(
    context: ReactContext?,
) : ReactViewGroup(context),
    ReactPointerEventsView {
    private val mWindowManager: WindowManager =
        context?.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    private var mainRootView: View? = null

    private var hostView: FullWindowOverlayRootViewGroup = FullWindowOverlayRootViewGroup(context, this)

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

    override fun getPointerEvents(): PointerEvents = PointerEvents.NONE

    override fun onAttachedToWindow() {
        var rootView: View? = this

        while (rootView != null && !(rootView is RootView)) {
            rootView = rootView.parent as? View
        }

        if (rootView != null) {
            mainRootView = rootView
        }

        super.onAttachedToWindow()
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

    fun getCurrentRootView(): View? = mainRootView

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
}
