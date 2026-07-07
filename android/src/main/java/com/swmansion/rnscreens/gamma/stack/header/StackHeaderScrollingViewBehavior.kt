package com.swmansion.rnscreens.gamma.stack.header

import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.appbar.AppBarLayout

internal class StackHeaderScrollingViewBehavior(
    private val onDependencyChanged: (contentTop: Int, dependency: View) -> Unit,
) : AppBarLayout.ScrollingViewBehavior() {
    override fun onDependentViewChanged(
        parent: CoordinatorLayout,
        child: View,
        dependency: View,
    ): Boolean {
        val result = super.onDependentViewChanged(parent, child, dependency)
        onDependencyChanged(child.top, dependency)
        return result
    }
}
