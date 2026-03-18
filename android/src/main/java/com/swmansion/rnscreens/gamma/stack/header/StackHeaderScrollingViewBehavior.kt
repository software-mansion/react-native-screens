package com.swmansion.rnscreens.gamma.stack.header

import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.appbar.AppBarLayout

internal class StackHeaderScrollingViewBehavior(
    private val onHeaderHeightChanged: (headerHeight: Int) -> Unit,
) : AppBarLayout.ScrollingViewBehavior() {
    override fun onDependentViewChanged(
        parent: CoordinatorLayout,
        child: View,
        dependency: View,
    ): Boolean {
        val result = super.onDependentViewChanged(parent, child, dependency)
        onHeaderHeightChanged(child.top)
        return result
    }
}
