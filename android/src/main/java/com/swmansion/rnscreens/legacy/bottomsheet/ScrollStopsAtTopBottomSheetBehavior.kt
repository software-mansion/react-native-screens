package com.swmansion.rnscreens.legacy.bottomsheet

import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.ViewCompat
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.legacy.Screen

/**
 * A drag that starts on a scrolled list scrolls the list and stops at its top.
 *
 * `BottomSheetBehavior` hands the rest of such a drag to the sheet as soon as the list reaches
 * its top, so a sheet with a single detent is dismissed mid-gesture: a list scrolled down by less
 * than the length of one drag can't be scrolled back up without closing the sheet. A drag that
 * starts with the list already at its top moves the sheet as before.
 */
internal open class ScrollStopsAtTopBottomSheetBehavior : BottomSheetBehavior<Screen>() {
    // Whether the ongoing touch nested scroll started with its target scrolled away from its top.
    // Set when this behavior accepts a touch nested scroll and cleared when it stops; in between
    // `CoordinatorLayout` dispatches the nested scroll callbacks of that type to this behavior only.
    private var nestedScrollStartedScrolled = false

    override fun onStartNestedScroll(
        coordinatorLayout: CoordinatorLayout,
        child: Screen,
        directTargetChild: View,
        target: View,
        axes: Int,
        type: Int,
    ): Boolean {
        val accepted = super.onStartNestedScroll(coordinatorLayout, child, directTargetChild, target, axes, type)
        if (accepted && type == ViewCompat.TYPE_TOUCH) {
            nestedScrollStartedScrolled = target.canScrollVertically(-1)
        }
        return accepted
    }

    override fun onNestedPreScroll(
        coordinatorLayout: CoordinatorLayout,
        child: Screen,
        target: View,
        dx: Int,
        dy: Int,
        consumed: IntArray,
        type: Int,
    ) {
        if (nestedScrollStartedScrolled && dy < 0 && !target.canScrollVertically(-1)) {
            return
        }
        super.onNestedPreScroll(coordinatorLayout, child, target, dx, dy, consumed, type)
    }

    override fun onStopNestedScroll(
        coordinatorLayout: CoordinatorLayout,
        child: Screen,
        target: View,
        type: Int,
    ) {
        if (type == ViewCompat.TYPE_TOUCH) {
            nestedScrollStartedScrolled = false
        }
        super.onStopNestedScroll(coordinatorLayout, child, target, type)
    }
}
