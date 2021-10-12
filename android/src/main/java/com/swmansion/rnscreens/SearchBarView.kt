package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.text.InputType
import android.view.View
import android.widget.EditText
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
    var defaultTextColor: Int? = null
    var textColor: Int? = null
    var placeholder: String? = null

    var mAreListenersSet: Boolean = false

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
            if (!mAreListenersSet) {
                setSearchViewListeners(searchView)
            }

            searchView.inputType = getSearchViewInputType()
            searchView.queryHint = placeholder
            val searchEditText =
                searchView.findViewById<View>(androidx.appcompat.R.id.search_src_text) as EditText
            if (textColor != null) {
                if (defaultTextColor == null) {
                    defaultTextColor = searchEditText.textColors.defaultColor
                }
                searchEditText.setTextColor(textColor!!)
            } else if (defaultTextColor != null) {
                searchEditText.setTextColor(defaultTextColor!!)
            }
        }
    }

    private fun setSearchViewListeners(searchView: SearchView) {
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
    }

    fun didPropsChange() {
        setSearchViewProps()
    }

    private fun sendEvent(eventName: String, eventContent: WritableMap?) {
        (context as ReactContext).getJSModule(RCTEventEmitter::class.java)
            ?.receiveEvent(id, eventName, eventContent)
    }

    private fun handleTextChange(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onChangeText", event)
    }

    private fun handleFocusChange(hasFocus: Boolean) {
        if (hasFocus)sendEvent("onFocus", null)
        else sendEvent("onBlur", null)
    }

    private fun handleTextSubmit(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onSearchButtonPress", event)
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
}
