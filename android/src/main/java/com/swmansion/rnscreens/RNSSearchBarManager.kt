package com.swmansion.rnscreens

import android.text.InputType
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
    fun setAutoCapitalize(view: RNSSearchBarView, autoCapitalize: Int) {
        view.searchView?.inputType = autoCapitalize
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.builder<String, Any>()
            .put("onChangeText", MapBuilder.of("registrationName", "onChangeText"))
            .put("onExpand", MapBuilder.of("registrationName", "onExpand"))
            .put("onCollapse", MapBuilder.of("registrationName", "onCollapse"))
            .build()
    }

    override fun getExportedViewConstants(): Map<String, Any?>? {
        return MapBuilder.of<String, Any?>(
            "AutoCapitalize",
            MapBuilder.of(
                "none", InputType.TYPE_CLASS_TEXT,
                "words", InputType.TYPE_TEXT_FLAG_CAP_WORDS,
                "sentences", InputType.TYPE_TEXT_FLAG_CAP_SENTENCES,
                "allCharacters", InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
            )
        )
    }

    companion object {
        const val REACT_CLASS = "RNSSearchBar"
    }
}
