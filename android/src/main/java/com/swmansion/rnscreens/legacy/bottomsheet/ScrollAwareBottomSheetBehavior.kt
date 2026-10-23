package com.swmansion.rnscreens.legacy.bottomsheet

import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior

/**
 * A BottomSheetBehavior that leaves a gesture to the content when it starts on a vertical scroll view that isn't at its
 * top, while the sheet is expanded.
 *
 * BottomSheetBehavior only looks for its scrolling child in `onLayoutChild`, while the sheet is presented: a scroll view
 * mounted later (e.g. once the screen's data has loaded) is never found, and scrolling it back up dragged the sheet down
 * instead, to its lower detent, then closed it.
 */
internal class ScrollAwareBottomSheetBehavior<V : View> : BottomSheetBehavior<V>() {
    private var isGestureForContent = false

    override fun onInterceptTouchEvent(
        parent: CoordinatorLayout,
        child: V,
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
        child: V,
        event: MotionEvent,
    ): Boolean = if (isGestureForContent) false else super.onTouchEvent(parent, child, event)

    // Nested scrolls from any scroll view, not only the one found at the last layout: a scroll view mounted later hands
    // the gesture over to the sheet once it reaches its top, within the same drag.
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
