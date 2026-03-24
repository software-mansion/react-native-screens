package com.swmansion.rnscreens.gamma.stack.header.configuration

import android.view.View
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderConfigurationManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderConfigurationManagerInterface
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview

@ReactModule(name = StackHeaderConfigurationViewManager.REACT_CLASS)
open class StackHeaderConfigurationViewManager :
    ViewGroupManager<StackHeaderConfiguration>(),
    RNSStackHeaderConfigurationManagerInterface<StackHeaderConfiguration> {
    private val delegate: ViewManagerDelegate<StackHeaderConfiguration>

    init {
        delegate = RNSStackHeaderConfigurationManagerDelegate<StackHeaderConfiguration, StackHeaderConfigurationViewManager>(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = StackHeaderConfiguration(reactContext)

    override fun getDelegate(): ViewManagerDelegate<StackHeaderConfiguration> = delegate

    override fun addView(
        parent: StackHeaderConfiguration,
        child: View,
        index: Int,
    ) {
        require(child is StackHeaderSubview) {
            "[RNScreens] StackHeaderConfiguration can only have children of type StackHeaderSubview. Received $child instead."
        }
        parent.addConfigSubview(child)
    }

    override fun removeView(parent: StackHeaderConfiguration, view: View) {
        require(view is StackHeaderSubview) {
            "[RNScreens] StackHeaderConfiguration can only have children of type StackHeaderSubview. Attempted to remove $view instead."
        }
        parent.removeConfigSubview(view)
    }

    override fun removeViewAt(
        parent: StackHeaderConfiguration,
        index: Int,
    ) {
        parent.removeConfigSubviewAt(index)
    }

    override fun removeAllViews(parent: StackHeaderConfiguration) {
        parent.removeAllConfigSubviews()
    }

    override fun getChildCount(parent: StackHeaderConfiguration): Int = parent.configSubviewsCount

    override fun getChildAt(
        parent: StackHeaderConfiguration,
        index: Int,
    ): View? = parent.getConfigSubviewAt(index)

    override fun updateState(
        view: StackHeaderConfiguration,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.stateWrapper = stateWrapper
        return super.updateState(view, props, stateWrapper)
    }

    override fun onAfterUpdateTransaction(view: StackHeaderConfiguration) {
        super.onAfterUpdateTransaction(view)
        view.notifyConfigurationChanged()
    }

    override fun setType(
        view: StackHeaderConfiguration,
        value: String?,
    ) {
        view.type =
            when (value) {
                "small" -> StackHeaderType.SMALL
                "medium" -> StackHeaderType.MEDIUM
                "large" -> StackHeaderType.LARGE
                else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid StackHeaderConfiguration type: $value.")
            }
    }

    override fun setTitle(
        view: StackHeaderConfiguration,
        value: String?,
    ) {
        view.title = value ?: ""
    }

    override fun setHidden(
        view: StackHeaderConfiguration,
        value: Boolean,
    ) {
        view.hidden = value
    }

    override fun setTransparent(
        view: StackHeaderConfiguration,
        value: Boolean,
    ) {
        view.transparent = value
    }

    companion object {
        const val REACT_CLASS = "RNSStackHeaderConfiguration"
    }
}
