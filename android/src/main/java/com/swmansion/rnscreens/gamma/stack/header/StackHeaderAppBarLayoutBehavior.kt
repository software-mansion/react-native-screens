package com.swmansion.rnscreens.gamma.stack.header

import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.appbar.AppBarLayout

/**
 * Pre-clamps nested down-scroll so the AppBar offset cannot exceed 0 (its natural rest).
 *
 * Without this, AppBarLayout has a bug where SCROLL | ENTER_ALWAYS | EXIT_UNTIL_COLLAPSED
 * combined with non-zero top window insets sets max = +topInset in onNestedPreScroll, allowing
 * pull-down overshoot that snap-back animates away on release. The downNestedPreScrollRange
 * inset clamp in AppBarLayout only fires when topInset > minimumHeight, which is rarely true
 * (typical actionBarSize ~56dp vs status bar ~24dp).
 */
internal class StackHeaderAppBarLayoutBehavior : AppBarLayout.Behavior() {
    override fun onNestedPreScroll(
        coordinatorLayout: CoordinatorLayout,
        child: AppBarLayout,
        target: View,
        dx: Int,
        dy: Int,
        consumed: IntArray,
        type: Int,
    ) {
        val adjustedDy = if (dy < 0) maxOf(dy, topAndBottomOffset) else dy
        super.onNestedPreScroll(coordinatorLayout, child, target, dx, adjustedDy, consumed, type)
    }
}
