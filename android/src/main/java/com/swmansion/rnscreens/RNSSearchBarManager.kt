package com.swmansion.rnscreens

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

@ReactModule(name = RNSSearchBarManager.REACT_CLASS)
class RNSSearchBarManager : ReactViewManager() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(context: ThemedReactContext): ReactViewGroup {
        return RNSSearchBarView(context)
    }

    @ReactProp(name = "autoCapitalize")
    fun setAutoCapitalize(view: RNSSearchBarView, autoCapitalize: String?) {
        view.autoCapitalize = when (autoCapitalize) {
            null, "none" -> RNSSearchBarView.RNSSearchBarAutoCapitalize.NONE
            "words" -> RNSSearchBarView.RNSSearchBarAutoCapitalize.WORDS
            "sentences" -> RNSSearchBarView.RNSSearchBarAutoCapitalize.SENTENCES
            "characters" -> RNSSearchBarView.RNSSearchBarAutoCapitalize.CHARACTERS
            else -> throw JSApplicationIllegalArgumentException(
                "Forbidden auto capitalize value passed"
            )
        }
        view.didPropsChange()
    }

    @ReactProp(name = "inputType")
    fun setInputType(view: RNSSearchBarView, inputType: String?) {
        view.inputType = when (inputType) {
            null, "text" -> RNSSearchBarView.RNSSearchBarInputTypes.TEXT
            "phone" -> RNSSearchBarView.RNSSearchBarInputTypes.PHONE
            "number" -> RNSSearchBarView.RNSSearchBarInputTypes.NUMBER
            "email" -> RNSSearchBarView.RNSSearchBarInputTypes.EMAIL
            else -> throw JSApplicationIllegalArgumentException(
                "Forbidden input type value"
            )
        }
        view.didPropsChange()
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.builder<String, Any>()
            .put("onChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("onTextSubmit", MapBuilder.of("registrationName", "onTextSubmit"))
            .put("onExpand", MapBuilder.of("registrationName", "onExpand"))
            .put("onCollapse", MapBuilder.of("registrationName", "onCollapse"))
            .build()
    }

    companion object {
        const val REACT_CLASS = "RNSSearchBar"
    }
}
