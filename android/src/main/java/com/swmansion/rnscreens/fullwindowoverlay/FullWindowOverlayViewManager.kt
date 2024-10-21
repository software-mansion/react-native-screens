package com.swmansion.rnscreens.fullwindowoverlay

import ModalHostHelper.getModalHostSize
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSFullWindowOverlayManagerDelegate
import com.facebook.react.viewmanagers.RNSFullWindowOverlayManagerInterface
import com.facebook.react.views.modal.ReactModalHostView

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

    public override fun updateState(
        view: FullWindowOverlay,
        props: ReactStylesDiffMap,
        stateWrapper: StateWrapper
    ): Any? {
        view.stateWrapper = stateWrapper
        val modalSize = getModalHostSize(view.context)
        view.updateState(modalSize.x, modalSize.y)
        return null
    }

    override fun invalidate() {
        super.invalidate()
    }
}
