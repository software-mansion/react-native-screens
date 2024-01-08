package com.swmansion.rnscreens

import android.content.Context
import android.content.res.TypedArray
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.R as MaterialR

class ScreenStackHeader(val screen: Screen) {
    var toolbar: CustomToolbar? = null
    var collapsingToolbarLayout: CollapsingToolbarLayout? = null

    fun recreateToolbar() {
        if (screen.headerType.isCollapsing) {
            toolbar?.layoutParams = CollapsingToolbarLayout.LayoutParams(
                CollapsingToolbarLayout.LayoutParams.MATCH_PARENT,
                android.R.attr.actionBarSize.resolveAttribute(screen.context)
            ).apply {
                collapseMode = CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN
            }
        }

        collapsingToolbarLayout = createCollapsingToolbarLayout().apply {
            addView(toolbar)
        }
    }

    fun removeToolbar() {
        toolbar?.removeAllViews()
        collapsingToolbarLayout?.removeAllViews()

        toolbar = null
        collapsingToolbarLayout = null
    }

    private fun createCollapsingToolbarLayout(): CollapsingToolbarLayout {
        val toolbarStyle = when (screen.headerType) {
            Screen.HeaderType.Large -> MaterialR.attr.collapsingToolbarLayoutLargeStyle
            Screen.HeaderType.Medium -> MaterialR.attr.collapsingToolbarLayoutMediumStyle
            else -> MaterialR.attr.collapsingToolbarLayoutStyle
        }

        return CollapsingToolbarLayout(screen.context, null, toolbarStyle).apply {
            layoutParams = AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.MATCH_PARENT)
                .apply {
                    scrollFlags = AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL or AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
                }

            fitsSystemWindows = true
        }
    }

    private fun Int.resolveAttribute(context: Context): Int {
        val textSizeAttr = intArrayOf(this)
        val indexOfAttrTextSize = 0

        val obtainedAttributesTa: TypedArray = context.obtainStyledAttributes(textSizeAttr)
        val parsedAttribute = obtainedAttributesTa.getDimensionPixelSize(indexOfAttrTextSize, -1)

        obtainedAttributesTa.recycle()
        return parsedAttribute
    }
}