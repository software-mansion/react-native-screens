package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.text.InputType
import androidx.appcompat.widget.SearchView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class SearchBarView(reactContext: ReactContext?) : ReactViewGroup(reactContext) {
    enum class SearchBarAutoCapitalize {
        NONE, WORDS, SENTENCES, CHARACTERS
    }

    enum class SearchBarInputTypes {
        TEXT, PHONE, NUMBER, EMAIL
    }

    var inputType: SearchBarInputTypes = SearchBarInputTypes.TEXT
    var autoCapitalize: SearchBarAutoCapitalize = SearchBarAutoCapitalize.NONE

    private val screenStackFragment: ScreenStackFragment?
        get() {
            val currentParent = parent
            if (currentParent is ScreenStackHeaderSubview) {
                return currentParent.config?.screenFragment
            }
            return null
        }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        setSearchViewProps()
        screenStackFragment?.onSearchViewCreate = { setSearchViewProps() }
    }

    private fun setSearchViewProps() {
        val searchView = screenStackFragment?.searchView
        if (searchView != null) {
            searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
                override fun onQueryTextChange(newText: String?): Boolean {
                    handleTextChange(newText)
                    return true
                }

                override fun onQueryTextSubmit(query: String?): Boolean {
                    handleTextSubmit(query)
                    return true
                }
            })
            searchView.setOnQueryTextFocusChangeListener { _, hasFocus ->
                handleFocusChange(hasFocus)
            }
            searchView.inputType = getSearchViewInputType()
        }
    }

    fun didPropsChange() {
        setSearchViewProps()
    }

    private fun sendEvent(eventName: String, eventContent: WritableMap?) {
        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java)
            ?.receiveEvent(id, eventName, eventContent)
    }

    private fun handleTextChange(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onChangeText", event)
    }

    private fun handleFocusChange(hasFocus: Boolean) {
        when (hasFocus) {
            true -> sendEvent("onFocus", null)
            false -> sendEvent("onBlur", null)
        }
    }

    private fun handleTextSubmit(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onTextSubmit", event)
    }

    private fun getSearchViewInputType(): Int {
        return when (inputType) {
            SearchBarInputTypes.PHONE -> InputType.TYPE_CLASS_PHONE
            SearchBarInputTypes.NUMBER -> InputType.TYPE_CLASS_NUMBER
            SearchBarInputTypes.EMAIL -> InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
            SearchBarInputTypes.TEXT -> when (autoCapitalize) {
                SearchBarAutoCapitalize.NONE -> InputType.TYPE_CLASS_TEXT
                SearchBarAutoCapitalize.WORDS -> InputType.TYPE_TEXT_FLAG_CAP_WORDS
                SearchBarAutoCapitalize.SENTENCES -> InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
                SearchBarAutoCapitalize.CHARACTERS -> InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
            }
        }
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
