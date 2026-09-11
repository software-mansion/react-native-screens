package com.swmansion.rnscreens.stack.header.appbar

import android.content.Context
import android.view.Gravity
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubview

/**
 * Toolbar of a collapsing header.
 *
 * CollapsingToolbarLayout tracks the collapsed title area by injecting a MATCH_PARENT placeholder
 * view into the toolbar, and it inherits the toolbar's default START gravity - the same layout
 * group our leading subview goes into. The toolbar walks that group in reverse child order under
 * RTL, so the placeholder is positioned first and takes over the whole layout cursor, leaving the
 * collapsed title drawn over the trailing subview and the toolbar menu. CENTER_HORIZONTAL moves it
 * to the group the toolbar positions last, clamped into what the other children left over, which
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

        // Every view the toolbar builds for itself (navigation & collapse buttons, menu, logo,
        // expanded action view) is WRAP_CONTENT, and so are our subviews, so a MATCH_PARENT child
        // can only be the placeholder.
        val params = child.layoutParams as LayoutParams
        if (child is StackHeaderSubview || params.width != MATCH_PARENT || params.height != MATCH_PARENT) {
            return
        }

        params.gravity = Gravity.CENTER_HORIZONTAL or Gravity.CENTER_VERTICAL
        hasCollapsedTitlePlaceholder = true
    }

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
