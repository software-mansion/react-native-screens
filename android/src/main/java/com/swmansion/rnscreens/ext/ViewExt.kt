package com.swmansion.rnscreens.ext

import android.graphics.drawable.ColorDrawable
import android.view.View
import android.view.ViewGroup

internal fun View.parentAsView() = this.parent as? View

internal fun View.parentAsViewGroup() = this.parent as? ViewGroup

internal fun View.recycle(): View {
    // screen fragments reuse view instances instead of creating new ones. In order to reuse a given
    // view it needs to be detached from the view hierarchy to allow the fragment to attach it back.
    this.parentAsViewGroup()?.let { parent ->
        parent.endViewTransition(this)
        parent.removeView(this)
    }

    // view detached from fragment manager get their visibility changed to GONE after their state is
    // dumped. Since we don't restore the state but want to reuse the view we need to change
    // visibility back to VISIBLE in order for the fragment manager to animate in the view.
    this.visibility = View.VISIBLE
    return this
}

internal fun View.maybeBgColor(): Int? {
    val bgDrawable = this.background
    if (bgDrawable is ColorDrawable) {
        return bgDrawable.color
    }
    return null
}
