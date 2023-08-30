package com.swmansion.rnscreens.ext

import android.view.View
import android.view.ViewGroup

// Implementation taken from `ScreenFragment.recycleView`
fun View.recycle(): View {
    val parent = this.parent
    parent?.let {
        (it as ViewGroup).endViewTransition(this)
        it.removeView(this)
    }

    this.visibility = View.VISIBLE
    return this
}