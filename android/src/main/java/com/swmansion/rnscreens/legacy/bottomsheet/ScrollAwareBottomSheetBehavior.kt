package com.swmansion.rnscreens.legacy.bottomsheet

import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetScrollingChild
import com.swmansion.rnscreens.legacy.Screen

/**
 * Leaves a gesture to the content when it starts on a vertical scroll view that isn't at its top,
 * while the sheet is expanded.
 *
 * `BottomSheetBehavior` only looks for its scrolling child in `onLayoutChild`, while the sheet is
 * presented: a scroll view mounted later (e.g. once the screen's data has loaded) is never found,
 * and scrolling it back up dragged the sheet down instead, to its lower detent, then closed it.
 * And the one it found stays its scrolling child once its screen is under another one (e.g. a
 * screen pushed on a stack nested in the sheet), detached: a gesture starting where it was (the
 * whole sheet, a detached view having no position) was never the sheet's, so only a scroll view's
 * nested scrolls moved it, not the header's drags nor those of a screen that doesn't scroll.
 */
internal class ScrollAwareBottomSheetBehavior : ScrollStopsAtTopBottomSheetBehavior() {
    private var isGestureForContent = false

    override fun onLayoutChild(
        parent: CoordinatorLayout,
        child: Screen,
        layoutDirection: Int,
    ): Boolean {
        val result = super.onLayoutChild(parent, child, layoutDirection)
        // Our own checks of the scroll views replace it (`onInterceptTouchEvent`,
        // `isNestedScrollingCheckEnabled`).
        BottomSheetScrollingChild.forget(this)
        return result
    }

    override fun onInterceptTouchEvent(
        parent: CoordinatorLayout,
        child: Screen,
        event: MotionEvent,
    ): Boolean {
        if (event.actionMasked == MotionEvent.ACTION_DOWN) {
            isGestureForContent = state == STATE_EXPANDED && hasScrolledContentAt(child, event.rawX, event.rawY)
        }
        if (isGestureForContent) {
            if (event.actionMasked == MotionEvent.ACTION_UP || event.actionMasked == MotionEvent.ACTION_CANCEL) {
                isGestureForContent = false
            }
            return false
        }
        return super.onInterceptTouchEvent(parent, child, event)
    }

    override fun onTouchEvent(
        parent: CoordinatorLayout,
        child: Screen,
        event: MotionEvent,
    ): Boolean = if (isGestureForContent) false else super.onTouchEvent(parent, child, event)

    // Nested scrolls from any scroll view, not only the one found at the last layout: a drag that
    // starts at the top of a scroll view mounted later moves the sheet, as with one mounted with it.
    override fun isNestedScrollingCheckEnabled(): Boolean = false

    private fun hasScrolledContentAt(
        view: View,
        rawX: Float,
        rawY: Float,
    ): Boolean {
        if (view.visibility != View.VISIBLE || !isPointInView(view, rawX, rawY)) {
            return false
        }
        if (view.canScrollVertically(-1)) {
            return true
        }
        if (view is ViewGroup) {
            for (i in 0 until view.childCount) {
                if (hasScrolledContentAt(view.getChildAt(i), rawX, rawY)) {
                    return true
                }
            }
        }
        return false
    }

    private fun isPointInView(
        view: View,
        rawX: Float,
        rawY: Float,
    ): Boolean {
        val location = IntArray(2)
        view.getLocationOnScreen(location)
        return rawX >= location[0] &&
            rawX < location[0] + view.width &&
            rawY >= location[1] &&
            rawY < location[1] + view.height
    }
}
