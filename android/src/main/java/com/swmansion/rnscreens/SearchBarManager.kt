package com.swmansion.rnscreens

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = SearchBarManager.REACT_CLASS)
class SearchBarManager : ViewGroupManager<SearchBarView>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(context: ThemedReactContext): SearchBarView {
        return SearchBarView(context)
    }

    override fun onAfterUpdateTransaction(view: SearchBarView) {
        super.onAfterUpdateTransaction(view)
        view.propsDidChange()
    }

    @ReactProp(name = "textColor", customType = "Color")
    fun setTextColor(view: SearchBarView, color: Int?) {
        if (color != null) {
            view.textColor = color
        } else {
            view.textColor = null
        }
    }

    @ReactProp(name = "tintColor", customType = "Color")
    fun setTintColor(view: SearchBarView, color: Int?) {
        if (color != null) {
            view.tintColor = color
        } else {
            view.tintColor = null
        }
    }

    @ReactProp(name = "placeholder")
    fun setPlaceholder(view: SearchBarView, placeholder: String?) {
        view.placeholder = placeholder
    }

    @ReactProp(name = "autoCapitalize")
    fun setAutoCapitalize(view: SearchBarView, autoCapitalize: String?) {
        view.autoCapitalize = when (autoCapitalize) {
            null, "none" -> SearchBarView.SearchBarAutoCapitalize.NONE
            "words" -> SearchBarView.SearchBarAutoCapitalize.WORDS
            "sentences" -> SearchBarView.SearchBarAutoCapitalize.SENTENCES
            "characters" -> SearchBarView.SearchBarAutoCapitalize.CHARACTERS
            else -> throw JSApplicationIllegalArgumentException(
                "Forbidden auto capitalize value passed"
            )
        }
    }

    @ReactProp(name = "inputType")
    fun setInputType(view: SearchBarView, inputType: String?) {
        view.inputType = when (inputType) {
            null, "text" -> SearchBarView.SearchBarInputTypes.TEXT
            "phone" -> SearchBarView.SearchBarInputTypes.PHONE
            "number" -> SearchBarView.SearchBarInputTypes.NUMBER
            "email" -> SearchBarView.SearchBarInputTypes.EMAIL
            else -> throw JSApplicationIllegalArgumentException(
                "Forbidden input type value"
            )
        }
    }

    @ReactProp(name = "overrideBackButton")
    fun setOverrideBackButton(view: SearchBarView, overrideBackButton: Boolean) {
        view.shouldOverrideBackButton=overrideBackButton
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.builder<String, Any>()
            .put("onChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("onSearchButtonPress", MapBuilder.of("registrationName", "onSearchButtonPress"))
            .put("onFocus", MapBuilder.of("registrationName", "onFocus"))
            .put("onBlur", MapBuilder.of("registrationName", "onBlur"))
            .put("onClose", MapBuilder.of("registrationName", "onClose"))
            .build()
    }

    companion object {
        const val REACT_CLASS = "RNSSearchBar"
    }
}
