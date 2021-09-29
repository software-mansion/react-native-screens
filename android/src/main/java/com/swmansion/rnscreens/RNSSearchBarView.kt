package com.swmansion.rnscreens

import android.content.Context;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageButton;

import androidx.appcompat.widget.SearchView;
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup
import com.google.android.material.appbar.AppBarLayout


class RNSSearchBarView(context: ReactContext?) : ReactViewGroup(context) {
    var searchView: SearchView? = SearchView(context)

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        if(searchView != null) {
            if (searchView!!.requestFocusFromTouch()) {
                val inputMethodManager: InputMethodManager = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                if (inputMethodManager != null) inputMethodManager.showSoftInput(searchView!!.findFocus(), 0)
            }
            val toolbar = parent?.parent
            if(toolbar is RNSToolbar)
            {
                toolbar.onSearchAddedListener=object: RNSToolbar.OnSearchListener{
                    override fun onSearchAdd(searchMenuItem: MenuItem?) {
                        searchMenuItem?.actionView = searchView
                    }

                    override fun onSearchCollapse() {
                        TODO("Not yet implemented")
                    }

                    override fun onSearchExpand() {
                        TODO("Not yet implemented")
                    }
                }
                toolbar.updateMenu()
            } else {
                parent.parent
            }
        }
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {}
}
