package com.swmansion.rnscreens.helpers

import android.view.View
import android.view.ViewGroup
import android.widget.ScrollView
import androidx.core.view.isNotEmpty
import androidx.core.widget.NestedScrollView

object ViewFinder {
    fun findScrollViewInFirstDescendantChain(view: View): ViewGroup? {
        var currentView: View? = view

        while (currentView != null) {
            if (currentView is ScrollView || currentView is NestedScrollView) {
                return currentView
            } else if (currentView is ViewGroup && currentView.isNotEmpty()) {
                currentView = currentView.getChildAt(0)
            } else {
                break
            }
        }

        return null
    }
}
