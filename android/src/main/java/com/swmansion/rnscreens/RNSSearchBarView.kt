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
class RNSSearchBarView(reactContext: ReactContext?) : ReactViewGroup(reactContext) {
    enum class RNSSearchBarAutoCapitalize {
        NONE, WORDS, SENTENCES, CHARACTERS
    }

    enum class RNSSearchBarInputTypes {
        TEXT, PHONE, NUMBER, EMAIL
    }

    var inputType: RNSSearchBarInputTypes = RNSSearchBarInputTypes.TEXT
    var autoCapitalize: RNSSearchBarAutoCapitalize = RNSSearchBarAutoCapitalize.NONE

    private val screenStackFragment: ScreenStackFragment?
        get() {
            val screenStackFragment =
                (parent?.parent?.parent?.parent?.parent as ScreenStack?)?.topScreen?.fragment
            if (screenStackFragment is ScreenStackFragment) {
                return screenStackFragment
            }
            return null
        }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        setSearchViewProps()
        screenStackFragment?.onSearchViewCreate = {setSearchViewProps()}
    }

    private fun setSearchViewProps(){
        val searchView = screenStackFragment?.searchView
        if(searchView != null){
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
            searchView.inputType=getSearchViewInputType()
        }
    }

    fun didPropsChange(){
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

    private fun handleTextSubmit(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onTextSubmit", event)
    }

    private fun getSearchViewInputType():Int {
        return when (inputType) {
            RNSSearchBarInputTypes.PHONE -> InputType.TYPE_CLASS_PHONE
            RNSSearchBarInputTypes.NUMBER -> InputType.TYPE_CLASS_NUMBER
            RNSSearchBarInputTypes.EMAIL -> InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
            RNSSearchBarInputTypes.TEXT -> when (autoCapitalize) {
                RNSSearchBarAutoCapitalize.NONE -> InputType.TYPE_CLASS_TEXT
                RNSSearchBarAutoCapitalize.WORDS -> InputType.TYPE_TEXT_FLAG_CAP_WORDS
                RNSSearchBarAutoCapitalize.SENTENCES -> InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
                RNSSearchBarAutoCapitalize.CHARACTERS -> InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
            }
        }
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
