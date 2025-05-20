package com.swmansion.rnscreens.bottomsheet

import android.view.MotionEvent
import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.bottomsheet.SimpleImeAnimationController.SimpleImeAnimationController

class CustomBottomSheetBehavior<T : View>(
    val screen: Screen,
) : BottomSheetBehavior<T>() {
    private val controller = SimpleImeAnimationController()
    private var lastTouch: Float? = null
    private var isImeVisible = false
    var isAnimating = false
        private set

    fun requestCloseGesture() {
        isImeVisible = true
    }

    fun dismissCloseGesture() {
        isImeVisible = false
    }

    override fun onTouchEvent(
        parent: CoordinatorLayout,
        child: T,
        event: MotionEvent,
    ): Boolean {
        /*
         * onApplyWindowInset is called with ime not visible immediately after we start touch
         * we want to keep dragging until we finish with te started touch, thus two variables
         * isImeVisible represents ime state
         * isAnimating represents if the drag down gesture started
         * */
        if (!isImeVisible && !isAnimating) {
            return super.onTouchEvent(parent, child, event)
        }

        isAnimating = true

        return when (event.action) {
            MotionEvent.ACTION_MOVE -> {
                if (lastTouch != null) {
                    val dy = event.y - lastTouch!!
                    if (!controller.isInsetAnimationInProgress()) {
                        controller.startControlRequest(child)
                    } else {
                        controller.insetBy(dy.toInt())
                    }
                }
                lastTouch = event.y
                return true
            }
            MotionEvent.ACTION_UP -> {
                controller.finish()
                isAnimating = false
                lastTouch = null
                return true
            }
            MotionEvent.ACTION_CANCEL -> {
                controller.cancel()
                isAnimating = false
                lastTouch = null
                return true
            }
            else -> true
        }
    }
}

internal fun <T : View> CustomBottomSheetBehavior<T>.useSingleDetent(
    height: Int? = null,
    forceExpandedState: Boolean = true,
): CustomBottomSheetBehavior<T> {
    this.skipCollapsed = true
    this.isFitToContents = true
    if (forceExpandedState) {
        this.state = BottomSheetBehavior.STATE_EXPANDED
    }
    height?.let {
        maxHeight = height
    }
    return this
}

internal fun <T : View> CustomBottomSheetBehavior<T>.useTwoDetents(
    @BottomSheetBehavior.StableState state: Int? = null,
    firstHeight: Int? = null,
    secondHeight: Int? = null,
): CustomBottomSheetBehavior<T> {
    skipCollapsed = false
    isFitToContents = true
    state?.let { this.state = state }
    firstHeight?.let { peekHeight = firstHeight }
    secondHeight?.let { maxHeight = secondHeight }
    return this
}

internal fun <T : View> CustomBottomSheetBehavior<T>.useThreeDetents(
    @BottomSheetBehavior.StableState state: Int? = null,
    firstHeight: Int? = null,
    halfExpandedRatio: Float? = null,
    expandedOffsetFromTop: Int? = null,
): CustomBottomSheetBehavior<T> {
    skipCollapsed = false
    isFitToContents = false
    state?.let { this.state = state }
    firstHeight?.let { this.peekHeight = firstHeight }
    halfExpandedRatio?.let { this.halfExpandedRatio = halfExpandedRatio }
    expandedOffsetFromTop?.let { this.expandedOffset = expandedOffsetFromTop }
    return this
}
