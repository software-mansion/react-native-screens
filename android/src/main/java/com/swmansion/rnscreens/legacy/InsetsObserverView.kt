package com.swmansion.rnscreens.legacy

import android.content.Context
import android.view.View
import android.view.ViewGroup

/**
 * Invisible, zero-sized view through which [InsetsObserverProxy] observes window insets.
 *
 * A view keeps a single `OnApplyWindowInsetsListener`, so a child we own receives the same insets without competing
 * for the decor view's listener with other libraries.
 */
internal class InsetsObserverView(
    context: Context,
) : View(context) {
    init {
        visibility = INVISIBLE
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
    }

    fun attachTo(decorView: ViewGroup) {
        decorView.addView(this, 0, ViewGroup.LayoutParams(0, 0))
    }

    fun detach() {
        (parent as? ViewGroup)?.removeView(this)
    }
}
