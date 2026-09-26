package com.swmansion.rnscreens.stack.header.appbar

import android.content.Context
import android.view.Gravity
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubview

/**
 * Toolbar of a collapsing header. It exists to change the gravity of the
 * placeholder view that CollapsingToolbarLayout adds to the toolbar, so that
 * custom subview layout under RTL is correct.
 *
 * CollapsingToolbarLayout tracks the area the collapsed title is drawn in by
 * adding a placeholder view with MATCH_PARENT layout params to the toolbar -
 * the view itself doesn't draw the title, it is only measured. The placeholder
 * inherits the toolbar's default START gravity, which is the same layout group
 * our leading subview goes into. The toolbar walks that group in reverse child
 * order under RTL, so the placeholder is positioned first and takes over the
 * whole layout cursor, leaving the collapsed title drawn over the trailing
 * subview and the toolbar menu. CENTER_HORIZONTAL moves it to the group the
 * toolbar positions last, clamped into what the other children left over, which
 * is the correct rect in both directions.
 *
 * See https://github.com/material-components/material-components-android/issues/1867.
 */
internal class StackHeaderToolbar(
    context: Context,
) : MaterialToolbar(context) {
    private var hasCollapsedTitlePlaceholder = false

    override fun onViewAdded(child: View) {
        super.onViewAdded(child)

        val params = child.layoutParams as LayoutParams
        if (!isCollapsedTitlePlaceholder(child, params)) {
            return
        }

        params.gravity = Gravity.CENTER_HORIZONTAL or Gravity.CENTER_VERTICAL
        hasCollapsedTitlePlaceholder = true
    }

    /**
     * The placeholder is not identifiable by type - it is a plain [View] - so it is recognized by
     * its size instead. Every view the toolbar builds for itself (navigation & collapse buttons,
     * menu, logo, expanded action view) is WRAP_CONTENT, and so are the subviews we add, which
     * leaves a MATCH_PARENT child of a foreign type as the placeholder and nothing else.
     */
    private fun isCollapsedTitlePlaceholder(
        child: View,
        params: LayoutParams,
    ): Boolean =
        child !is StackHeaderSubview &&
            params.width == MATCH_PARENT &&
            params.height == MATCH_PARENT

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        // The placeholder is added from CollapsingToolbarLayout.onMeasure, which always precedes
        // our layout. Holds as long as the collapsing layout keeps its title enabled.
        check(hasCollapsedTitlePlaceholder) {
            "[RNScreens] CollapsingToolbarLayout did not add its collapsed title placeholder."
        }

        super.onLayout(changed, l, t, r, b)
    }
}
