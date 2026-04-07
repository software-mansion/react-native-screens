package com.swmansion.rnscreens.gamma.stack.header.subview

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderSubviewAndroidManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderSubviewAndroidManagerInterface

@ReactModule(name = StackHeaderSubviewViewManager.REACT_CLASS)
open class StackHeaderSubviewViewManager :
    ViewGroupManager<StackHeaderSubview>(),
    RNSStackHeaderSubviewAndroidManagerInterface<StackHeaderSubview> {
    private val delegate: ViewManagerDelegate<StackHeaderSubview>

    init {
        delegate = RNSStackHeaderSubviewAndroidManagerDelegate<StackHeaderSubview, StackHeaderSubviewViewManager>(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = StackHeaderSubview(reactContext)

    override fun getDelegate(): ViewManagerDelegate<StackHeaderSubview> = delegate

    override fun setType(
        view: StackHeaderSubview,
        value: String?,
    ) {
        view.type =
            when (value) {
                "leading" -> StackHeaderSubviewType.LEADING
                "center" -> StackHeaderSubviewType.CENTER
                "trailing" -> StackHeaderSubviewType.TRAILING
                "background" -> StackHeaderSubviewType.BACKGROUND
                else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid StackHeaderSubview type: $value")
            }
    }

    override fun setCollapseMode(
        view: StackHeaderSubview,
        value: String?,
    ) {
        view.collapseMode =
            when (value) {
                "off" -> StackHeaderSubviewCollapseMode.OFF
                "parallax" -> StackHeaderSubviewCollapseMode.PARALLAX
                else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid StackHeaderSubview collapseMode: $value")
            }
    }

    override fun updateState(
        view: StackHeaderSubview,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.stateWrapper = stateWrapper
        return super.updateState(view, props, stateWrapper)
    }

    companion object {
        const val REACT_CLASS = "RNSStackHeaderSubviewAndroid"
    }
}
