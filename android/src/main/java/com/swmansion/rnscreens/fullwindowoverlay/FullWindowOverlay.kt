package com.swmansion.rnscreens.fullwindowoverlay

import android.content.Context
import android.graphics.PixelFormat
import android.view.View
import android.view.ViewStructure
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.utils.WindowOverlayCompat

class FullWindowOverlay(
    context: ReactContext?,
) : ReactViewGroup(context),
    ReactPointerEventsView,
    LifecycleEventListener {
    private var isCreated = false

    private val mWindowManager: WindowManager =
        context?.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    private var mainRootView: View? = null

    private var hostView: FullWindowOverlayRootViewGroup = FullWindowOverlayRootViewGroup(context, this)

    var stateWrapper: StateWrapper?
        get() = hostView.stateWrapper
        set(stateWrapper) {
            hostView.stateWrapper = stateWrapper
        }

    var eventDispatcher: EventDispatcher?
        get() = hostView.eventDispatcher
        set(eventDispatcher) {
            hostView.eventDispatcher = eventDispatcher
        }

    fun updateState(width: Int, height: Int) {
        hostView.updateState(width, height)
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
        setupView()
        context?.addLifecycleEventListener(this)
    }

    fun setupView() {
        if (!isCreated) {
            val params =
                WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT,
//                    WindowManager.LayoutParams.LAST_APPLICATION_WINDOW,
                    WindowOverlayCompat.TYPE_SYSTEM_OVERLAY,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT,
                )
            mWindowManager.addView(hostView, params)
            isCreated = true
        }
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
        mWindowManager.removeView(hostView)
        isCreated = false
    }

    public override fun dispatchProvideStructure(structure: ViewStructure) {
        hostView.dispatchProvideStructure(structure)
    }

    override fun onHostResume() {
        println("onHostResume")
        setupView()
    }

    override fun onHostPause() {
        println("onHostPause")
        onDropInstance()
    }

    override fun onHostDestroy() {
        onDropInstance()
        println("onHostDestroy")
    }
}
