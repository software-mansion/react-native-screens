package com.swmansion.rnscreens.gamma.stack.header.configuration

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderConfigurationManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderConfigurationManagerInterface

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

    override fun setType(view: StackHeaderConfiguration, value: String?) = Unit
    override fun setTitle(view: StackHeaderConfiguration, value: String?) = Unit
    override fun setHidden(view: StackHeaderConfiguration, value: Boolean) = Unit
    override fun setTransparent(view: StackHeaderConfiguration, value: Boolean) = Unit

    companion object {
        const val REACT_CLASS = "RNSStackHeaderConfiguration"
    }
}