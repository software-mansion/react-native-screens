package com.swmansion.rnscreens.gamma.helpers

import android.view.View
import android.view.ViewGroup
import android.widget.ScrollView
import androidx.core.view.isNotEmpty
import com.swmansion.rnscreens.ScreenStack

object ViewFinder {
    fun findScrollViewInFirstDescendantChain(view: View): ScrollView? {
        var currentView: View? = view

        while (currentView != null) {
            if (currentView is ScrollView) {
                return currentView
            } else if (currentView is ViewGroup && currentView.isNotEmpty()) {
                currentView = currentView.getChildAt(0)
            } else {
                break
            }
        }

        return null
    }

    fun findScreenStackInFirstDescendantChain(view: View): ScreenStack? {
        var currentView: View? = view

        while (currentView != null) {
            if (currentView is ScreenStack) {
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
