// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager
import com.facebook.react.viewmanagers.RNSSafeAreaViewManagerInterface

@ReactModule(name = SafeAreaViewManager.REACT_CLASS)
class SafeAreaViewManager :
    ReactViewManager(),
    RNSSafeAreaViewManagerInterface<ReactViewGroup> {
    private val delegate: ViewManagerDelegate<ReactViewGroup> = SafeAreaViewManagerDelegate(this)

    override fun getName() = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): SafeAreaView = SafeAreaView(context)

    override fun getDelegate() = delegate

    override fun setEdges(
        view: ReactViewGroup,
        value: ReadableMap?,
    ) {
        SafeAreaViewEdges.fromProp(value)?.let {
            (view as SafeAreaView).setEdges(it)
        }
    }

    override fun setInsetType(
        view: ReactViewGroup,
        value: String?,
    ) {
        val insetType =
            when (value) {
                null, "all" -> InsetType.ALL
                "system" -> InsetType.SYSTEM
                "interface" -> InsetType.INTERFACE
                else -> throw JSApplicationIllegalArgumentException("Unknown inset type $value")
            }

        (view as SafeAreaView).setInsetType(insetType)
    }

    override fun updateState(
        view: ReactViewGroup,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        (view as SafeAreaView).setStateWrapper(stateWrapper)
        return super.updateState(view, props, stateWrapper)
    }

    companion object {
        const val REACT_CLASS = "RNSSafeAreaView"
    }
}
