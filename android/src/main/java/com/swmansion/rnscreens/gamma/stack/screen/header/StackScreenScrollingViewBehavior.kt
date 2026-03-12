package com.swmansion.rnscreens.gamma.stack.screen.header

import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.appbar.AppBarLayout

internal class StackScreenScrollingViewBehavior(
    private val onContentOffsetChanged: (headerHeight: Int) -> Unit,
) : AppBarLayout.ScrollingViewBehavior() {
    override fun onDependentViewChanged(
        parent: CoordinatorLayout,
        child: View,
        dependency: View,
    ): Boolean {
        val result = super.onDependentViewChanged(parent, child, dependency)
        onContentOffsetChanged(child.top)
        return result
    }
}
