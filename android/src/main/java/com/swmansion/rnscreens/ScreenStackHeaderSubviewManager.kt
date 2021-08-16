package com.swmansion.rnscreens

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

@ReactModule(name = ScreenStackHeaderSubviewManager.REACT_CLASS)
class ScreenStackHeaderSubviewManager : ReactViewManager() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
        return ScreenStackHeaderSubview(context)
    }

    @ReactProp(name = "type")
    fun setType(view: ScreenStackHeaderSubview, type: String) {
        when (type) {
            "left" -> view.type = ScreenStackHeaderSubview.Type.LEFT
            "center" -> view.type = ScreenStackHeaderSubview.Type.CENTER
            "right" -> view.type = ScreenStackHeaderSubview.Type.RIGHT
            "back" -> view.type = ScreenStackHeaderSubview.Type.BACK
        }
    }

    companion object {
        const val REACT_CLASS = "RNSScreenStackHeaderSubview"
    }
}
