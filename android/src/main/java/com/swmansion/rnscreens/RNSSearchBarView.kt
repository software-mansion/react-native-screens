package com.swmansion.rnscreens

import androidx.appcompat.widget.SearchView
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

class RNSSearchBarView(context: ReactContext?) : ReactViewGroup(context) {
    var searchView: SearchView? = SearchView(context)
    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        val screenStackFragment = (parent?.parent?.parent?.parent?.parent as ScreenStack)?.topScreen?.fragment
        if (screenStackFragment is ScreenStackFragment) {
            screenStackFragment.onTextChangeListener = object : SearchView.OnQueryTextListener {
                override fun onQueryTextChange(newText: String?): Boolean {
                    return true
                }

                override fun onQueryTextSubmit(query: String?): Boolean {
                    return true
                }
            }
        }
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
