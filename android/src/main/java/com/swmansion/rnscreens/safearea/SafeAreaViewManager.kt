// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSSafeAreaViewManagerDelegate
import com.facebook.react.viewmanagers.RNSSafeAreaViewManagerInterface
import com.swmansion.rnscreens.safearea.paper.SafeAreaViewEdges
import com.swmansion.rnscreens.safearea.paper.SafeAreaViewShadowNode

@ReactModule(name = SafeAreaViewManager.REACT_CLASS)
class SafeAreaViewManager :
    ViewGroupManager<SafeAreaView>(),
    RNSSafeAreaViewManagerInterface<SafeAreaView> {
    private val delegate: ViewManagerDelegate<SafeAreaView> = RNSSafeAreaViewManagerDelegate<SafeAreaView, SafeAreaViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): SafeAreaView = SafeAreaView(reactContext)

    override fun getDelegate() = delegate

    override fun createShadowNodeInstance() = SafeAreaViewShadowNode()

    override fun getShadowNodeClass() = SafeAreaViewShadowNode::class.java

    @ReactProp(name = "edges")
    override fun setEdges(
        view: SafeAreaView,
        value: ReadableMap?,
    ) {
        SafeAreaViewEdges.fromProp(value)?.let {
            view.setEdges(it)
        }
    }

    @ReactProp(name = "insetType")
    override fun setInsetType(
        view: SafeAreaView,
        value: String?,
    ) {
        val insetType =
            when (value) {
                null, "all" -> InsetType.ALL
                "system" -> InsetType.SYSTEM
                "interface" -> InsetType.INTERFACE
                else -> throw JSApplicationIllegalArgumentException("Unknown inset type $value")
            }

        view.setInsetType(insetType)
    }

    override fun updateState(
        view: SafeAreaView,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.setStateWrapper(stateWrapper)
        return super.updateState(view, props, stateWrapper)
    }

    companion object {
        const val REACT_CLASS = "RNSSafeAreaView"
    }
}
