package com.swmansion.rnscreens

import androidx.appcompat.widget.SearchView
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup

class RNSSearchBarView(context: ReactContext?) : ReactViewGroup(context) {
    var searchView: SearchView? = SearchView(context)

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
