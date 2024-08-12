package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.view.MotionEvent
import android.view.View
import androidx.annotation.UiThread
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.JSPointerDispatcher
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.viewmanagers.RNSFullWindowOverlayManagerDelegate
import com.facebook.react.viewmanagers.RNSFullWindowOverlayManagerInterface
import com.facebook.react.views.modal.ModalHostShadowNode
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.view.ReactViewGroup
import kotlin.math.abs

@ReactModule(name = FullWindowOverlayViewManager.REACT_CLASS)
class FullWindowOverlayViewManager :
    ViewGroupManager<FullWindowOverlay>(),
    RNSFullWindowOverlayManagerInterface<FullWindowOverlay> {

    private val delegate: ViewManagerDelegate<FullWindowOverlay> = RNSFullWindowOverlayManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<FullWindowOverlay> = delegate

    override fun getName() = REACT_CLASS

    companion object {
        const val REACT_CLASS = "RNSFullWindowOverlay"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): FullWindowOverlay = FullWindowOverlay(reactContext)

    public override fun createShadowNodeInstance(): LayoutShadowNode = ModalHostShadowNode()

    public override fun getShadowNodeClass(): Class<out LayoutShadowNode> =
        ModalHostShadowNode::class.java

    public override fun onDropViewInstance(view: FullWindowOverlay) {
        super.onDropViewInstance(view)
        view.onDropInstance()
    }

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
