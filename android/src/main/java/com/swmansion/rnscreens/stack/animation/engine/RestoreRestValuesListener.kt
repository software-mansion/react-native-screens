package com.swmansion.rnscreens.stack.animation.engine

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.view.View

/**
 * Fragment views are retained across detach, so a cancelled or reversed transition must not
 * leave them displaced.
 */
internal class RestoreRestValuesListener(
    private val view: View,
) : AnimatorListenerAdapter() {
    override fun onAnimationEnd(animation: Animator) = restore()

    override fun onAnimationCancel(animation: Animator) = restore()

    private fun restore() {
        view.translationX = 0f
        view.translationY = 0f
        view.alpha = 1f
        view.scaleX = 1f
        view.scaleY = 1f
    }
}
