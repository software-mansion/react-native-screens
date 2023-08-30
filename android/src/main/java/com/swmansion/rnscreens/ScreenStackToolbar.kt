package com.swmansion.rnscreens

import android.content.Context
import android.content.res.TypedArray
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout

class ScreenStackToolbar(val fragment: ScreenStackFragment) {
    var appBarLayout: AppBarLayout? = null
    var collapsingToolbarLayout: CollapsingToolbarLayout? = null
    var toolbar: Toolbar? = null

    private var isToolbarHidden = false

    fun removeToolbar() {
        isToolbarHidden = true
        appBarLayout?.let { layout ->
            collapsingToolbarLayout?.let { collapsingToolbar ->
                toolbar?.let { toolbar ->
                    if (toolbar.parent === collapsingToolbar) {
                        toolbar.removeView(collapsingToolbar)
                    }
                }

                if (collapsingToolbar.parent === layout) {
                    layout.removeView(collapsingToolbar)
                }
            }

            // As AppBarLayout may have dimensions of expanded medium / large header,
            // We need to change its layout params to `WRAP_CONTENT`.
            layout.layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.WRAP_CONTENT
            )
        }

        toolbar = null
        collapsingToolbarLayout = null
    }

    fun initializeToolbar(toolbar: Toolbar) {
        this.toolbar = toolbar
        isToolbarHidden = false

        toolbar.layoutParams = CollapsingToolbarLayout.LayoutParams(
            CollapsingToolbarLayout.LayoutParams.MATCH_PARENT,
            R.attr.actionBarSize.resolveAttribute(toolbar.context)
        ).apply {
            collapseMode = CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN
        }

        updatePropsFromToolbarToViews()

        collapsingToolbarLayout?.addView(toolbar)
        appBarLayout?.addView(collapsingToolbarLayout?.let { ScreenFragment.recycleView(it) })

        // As `setToolbar` may be called after changing header's visibility,
        // we need to apply correction to layoutParams with proper dimensions.
        appBarLayout?.layoutParams = CoordinatorLayout.LayoutParams(
            CoordinatorLayout.LayoutParams.MATCH_PARENT, getHeightOfToolbar(toolbar.context)
        )
    }

    fun createCollapsingToolbarLayout() {
        val toolbarStyle = when (fragment.screen.headerType) {
            Screen.HeaderType.Large -> R.attr.collapsingToolbarLayoutLargeStyle
            Screen.HeaderType.Medium -> R.attr.collapsingToolbarLayoutMediumStyle
            else -> R.attr.collapsingToolbarLayoutStyle
        }

        collapsingToolbarLayout = fragment.context?.let { CollapsingToolbarLayout(it, null, toolbarStyle) }?.apply {
            layoutParams = AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.MATCH_PARENT)
                .apply {
                    scrollFlags = AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL or AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
                }

            fitsSystemWindows = true
        }
    }

    fun setBackgroundColor(color: Int) {
        toolbar?.setBackgroundColor(color)
        collapsingToolbarLayout?.setBackgroundColor(color)
    }

    private fun updatePropsFromToolbarToViews() {
        if (toolbar?.background == null) {
            return
        }

        collapsingToolbarLayout?.apply {
            title = toolbar?.title
            isTitleEnabled = fragment.screen.headerType.isCollapsing
        }
    }

    fun getHeightOfToolbar(context: Context): Int {
        if (isToolbarHidden) {
            return CoordinatorLayout.LayoutParams.WRAP_CONTENT
        }

        return when (fragment.screen.headerType) {
            Screen.HeaderType.Medium -> R.attr.collapsingToolbarLayoutMediumSize.resolveAttribute(context)
            Screen.HeaderType.Large -> R.attr.collapsingToolbarLayoutLargeSize.resolveAttribute(context)
            else -> CoordinatorLayout.LayoutParams.WRAP_CONTENT
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