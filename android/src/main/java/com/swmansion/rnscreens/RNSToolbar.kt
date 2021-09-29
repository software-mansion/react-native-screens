package com.swmansion.rnscreens

import android.content.Context;
import android.view.Menu
import android.view.MenuItem;
import android.view.View
import androidx.appcompat.widget.Toolbar

open class RNSToolbar(context: Context) : Toolbar(context) {
    var onSearchAddedListener: OnSearchListener? = null

    fun updateMenu(){
        menu.clear()
        val item = menu.add(Menu.NONE, Menu.NONE, 0, "")
        onSearchAddedListener?.onSearchAdd(item)
    }

    interface OnSearchListener {
        fun onSearchAdd(searchMenuItem: MenuItem?)
        fun onSearchExpand()
        fun onSearchCollapse()
    }
}
