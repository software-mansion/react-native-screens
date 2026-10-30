package com.swmansion.rnscreens.core.modals.formsheet.dialog

import android.annotation.SuppressLint
import android.content.Context
import android.view.View
import android.widget.LinearLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDragHandleView

@SuppressLint("ViewConstructor")
class FormSheetContainer(
    context: Context,
    internal val contentView: View,
) : LinearLayout(context) {
    private val grabberView =
        BottomSheetDragHandleView(context).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.WRAP_CONTENT,
                )
            visibility = GONE
        }

    // The CoordinatorLayout child driven by the BottomSheetBehavior, held for the duration of a nested scroll.
    private var sheetView: View? = null

    private val sheetCoordinator: CoordinatorLayout?
        get() = sheetView?.parent as? CoordinatorLayout

    private val View.bottomSheetBehavior: BottomSheetBehavior<*>?
        get() = (layoutParams as? CoordinatorLayout.LayoutParams)?.behavior as? BottomSheetBehavior<*>

    private var startedOnScrolledTarget = false

    init {
        orientation = VERTICAL

        contentView.layoutParams =
            LayoutParams(
                LayoutParams.MATCH_PARENT,
                0,
                1.0f,
            )

        addView(grabberView)
        addView(contentView)
    }

    internal fun setGrabberVisible(visible: Boolean) {
        grabberView.visibility = if (visible) VISIBLE else GONE
    }

    private fun findSheetView(): View? {
        var view = parent as? View
        while (view != null && view.bottomSheetBehavior == null) {
            view = view.parent as? View
        }
        return view
    }

    private fun shouldHoldBackFromSheet(
        target: View,
        dy: Int,
    ): Boolean = startedOnScrolledTarget && dy < 0 && !target.canScrollVertically(-1)

    override fun onStartNestedScroll(
        child: View,
        target: View,
        axes: Int,
    ): Boolean {
        sheetView = findSheetView()
        val sheet = sheetView ?: return false
        val coordinator = sheetCoordinator
        if (coordinator == null || !coordinator.onStartNestedScroll(sheet, target, axes)) {
            sheetView = null
            return false
        }
        startedOnScrolledTarget = target.canScrollVertically(-1)
        return true
    }

    override fun onNestedScrollAccepted(
        child: View,
        target: View,
        axes: Int,
    ) {
        super.onNestedScrollAccepted(child, target, axes)
        val sheet = sheetView ?: return
        val coordinator = sheetCoordinator ?: return
        coordinator.onNestedScrollAccepted(sheet, target, axes)
    }

    override fun onNestedPreScroll(
        target: View,
        dx: Int,
        dy: Int,
        consumed: IntArray,
    ) {
        val coordinator = sheetCoordinator ?: return
        if (shouldHoldBackFromSheet(target, dy)) {
            return
        }
        coordinator.onNestedPreScroll(target, dx, dy, consumed)
    }

    override fun onStopNestedScroll(target: View) {
        super.onStopNestedScroll(target)
        startedOnScrolledTarget = false
        val coordinator = sheetCoordinator
        sheetView = null
        coordinator?.onStopNestedScroll(target)
    }

    override fun onNestedPreFling(
        target: View,
        velocityX: Float,
        velocityY: Float,
    ): Boolean {
        val coordinator = sheetCoordinator ?: return false
        return coordinator.onNestedPreFling(target, velocityX, velocityY)
    }
}
