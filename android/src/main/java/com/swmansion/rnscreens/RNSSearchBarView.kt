package com.swmansion.rnscreens

import androidx.appcompat.widget.SearchView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.views.view.ReactViewGroup

class RNSSearchBarView(reactContext: ReactContext?) : ReactViewGroup(reactContext) {
    private val screenStackFragment: ScreenStackFragment?
        get() {
            val screenStackFragment =
                (parent?.parent?.parent?.parent?.parent as ScreenStack)?.topScreen?.fragment
            if (screenStackFragment is ScreenStackFragment) {
                return screenStackFragment
            }
            return null
        }
    val searchView: SearchView?
        get() = screenStackFragment?.searchView

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        screenStackFragment?.onTextChangeListener = object : SearchView.OnQueryTextListener {
            override fun onQueryTextChange(newText: String?): Boolean {
                handleTextChange(newText)
                return true
            }

            override fun onQueryTextSubmit(query: String?): Boolean {
                handleTextSubmit(query)
                return true
            }
        }
    }

    fun sendEvent(eventName: String, eventContent: WritableMap?) {
        val reactContext = context as ReactContext
        reactContext.getJSModule(RCTEventEmitter::class.java)
            ?.receiveEvent(id, eventName, eventContent)
    }

    fun handleTextChange(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onChangeText", event)
    }

    fun handleTextSubmit(newText: String?) {
        val event = Arguments.createMap()
        event.putString("text", newText)
        sendEvent("onTextSubmit", event)
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
