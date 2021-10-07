package com.swmansion.rnscreens

import androidx.appcompat.widget.SearchView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.views.view.ReactViewGroup

class RNSSearchBarView(reactContext: ReactContext?) : ReactViewGroup(reactContext) {
    var searchView: SearchView? = SearchView(context)

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        val screenStackFragment = (parent?.parent?.parent?.parent?.parent as ScreenStack)?.topScreen?.fragment
        if (screenStackFragment is ScreenStackFragment) {
            screenStackFragment.onTextChangeListener = object : SearchView.OnQueryTextListener {
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
    }

    fun handleTextChange(newText: String?) {
        val reactContext = context as ReactContext
        val event = Arguments.createMap()
        event.putString("text", newText)
        reactContext.getJSModule(RCTEventEmitter::class.java)?.receiveEvent(id, "onChangeText", event)
    }

    fun handleTextSubmit(newText: String?) {
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
