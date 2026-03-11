package com.swmansion.rnscreens.gamma.stack.screen.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderType
import com.swmansion.rnscreens.utils.resolveDimensionAttr

internal sealed class StackScreenAppBarLayout(
    context: Context,
) : AppBarLayout(context) {
    abstract val toolbar: MaterialToolbar

    internal class Small(
        context: Context,
    ) : StackScreenAppBarLayout(context) {
        override val toolbar =
            MaterialToolbar(context).apply {
                elevation = 0f
                layoutParams = LayoutParams(MATCH_PARENT, WRAP_CONTENT)
            }

        init {
            addView(toolbar)
        }
    }

    @SuppressLint("ViewConstructor")
    internal class Collapsing(
        context: Context,
        val type: StackScreenHeaderType,
    ) : StackScreenAppBarLayout(context) {
        init {
            require(
                type == StackScreenHeaderType.MEDIUM ||
                    type == StackScreenHeaderType.LARGE,
            ) {
                "[RNScreens] Collapsing StackScreenAppBarLayout must be MEDIUM or LARGE type."
            }
        }

        override val toolbar =
            MaterialToolbar(context).apply {
                elevation = 0f
                layoutParams =
                    CollapsingToolbarLayout
                        .LayoutParams(
                            MATCH_PARENT,
                            resolveDimensionAttr(context, android.R.attr.actionBarSize),
                        ).apply {
                            collapseMode = CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN
                        }
            }

        val collapsingToolbarLayout: CollapsingToolbarLayout =
            run {
                val (styleAttr, sizeAttr) =
                    when (type) {
                        StackScreenHeaderType.MEDIUM ->
                            Pair(R.attr.collapsingToolbarLayoutMediumStyle, R.attr.collapsingToolbarLayoutMediumSize)
                        StackScreenHeaderType.LARGE ->
                            Pair(R.attr.collapsingToolbarLayoutLargeStyle, R.attr.collapsingToolbarLayoutLargeSize)
                        else -> error("[RNScreens] Invalid header mode.")
                    }
                CollapsingToolbarLayout(context, null, styleAttr).apply {
                    fitsSystemWindows = false
                    layoutParams =
                        LayoutParams(
                            MATCH_PARENT,
                            resolveDimensionAttr(context, sizeAttr),
                        )
                    addView(toolbar)
                }
            }

        init {
            addView(collapsingToolbarLayout)
        }
    }

    companion object {
        fun create(
            context: Context,
            type: StackScreenHeaderType,
        ): StackScreenAppBarLayout =
            when (type) {
                StackScreenHeaderType.SMALL -> Small(context)
                StackScreenHeaderType.MEDIUM, StackScreenHeaderType.LARGE -> Collapsing(context, type)
            }
    }
}
