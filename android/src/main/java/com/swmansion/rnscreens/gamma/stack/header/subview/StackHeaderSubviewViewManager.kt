package com.swmansion.rnscreens.gamma.stack.header.subview

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderSubviewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderSubviewManagerInterface

@ReactModule(name = StackHeaderSubviewViewManager.REACT_CLASS)
open class StackHeaderSubviewViewManager :
    ViewGroupManager<StackHeaderSubview>(),
    RNSStackHeaderSubviewManagerInterface<StackHeaderSubview> {
    private val delegate: ViewManagerDelegate<StackHeaderSubview>

    init {
        delegate = RNSStackHeaderSubviewManagerDelegate<StackHeaderSubview, StackHeaderSubviewViewManager>(this)
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
                "left" -> StackHeaderSubviewType.LEFT
                "center" -> StackHeaderSubviewType.CENTER
                "right" -> StackHeaderSubviewType.RIGHT
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
                "pin" -> StackHeaderSubviewCollapseMode.PIN
                "parallax" -> StackHeaderSubviewCollapseMode.PARALLAX
                else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid StackHeaderSubview collapseMode: $value")
            }
    }

    companion object {
        const val REACT_CLASS = "RNSStackHeaderSubview"
    }
}
