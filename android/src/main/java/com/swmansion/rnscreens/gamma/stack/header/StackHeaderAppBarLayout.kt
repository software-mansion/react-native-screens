package com.swmansion.rnscreens.gamma.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderType
import com.swmansion.rnscreens.utils.resolveDimensionAttr

internal sealed class StackHeaderAppBarLayout(
    context: Context,
) : AppBarLayout(context) {
    abstract val toolbar: MaterialToolbar

    init {
        layoutParams =
            CoordinatorLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT).apply {
                behavior = StackHeaderAppBarLayoutBehavior()
            }

        // TODO: this should be exposed in the future via prop. Also, it might not work correctly
        //       until we set liftOnScrollView manually. Also, we should disable it in transparent
        //       mode or set elevation higher.
        isLiftOnScroll = true

        // TODO: this won't work with nested header but there were some problems with lift on scroll
        //       without it when I was researching this.
        fitsSystemWindows = true
    }

    internal class Small(
        context: Context,
    ) : StackHeaderAppBarLayout(context) {
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
        val type: StackHeaderType,
    ) : StackHeaderAppBarLayout(context) {
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

        internal val collapsingToolbarLayout: CollapsingToolbarLayout =
            run {
                val (styleAttr, sizeAttr) =
                    when (type) {
                        StackHeaderType.MEDIUM ->
                            Pair(R.attr.collapsingToolbarLayoutMediumStyle, R.attr.collapsingToolbarLayoutMediumSize)
                        StackHeaderType.LARGE ->
                            Pair(R.attr.collapsingToolbarLayoutLargeStyle, R.attr.collapsingToolbarLayoutLargeSize)
                        else -> error("[RNScreens] Invalid header mode.")
                    }
                CollapsingToolbarLayout(context, null, styleAttr).apply {
                    layoutParams =
                        LayoutParams(
                            MATCH_PARENT,
                            resolveDimensionAttr(context, sizeAttr),
                        )
                    addView(toolbar)
                }
            }

        init {
            require(
                type == StackHeaderType.MEDIUM ||
                    type == StackHeaderType.LARGE,
            ) {
                "[RNScreens] Collapsing StackHeaderAppBarLayout must be MEDIUM or LARGE type."
            }
            addView(collapsingToolbarLayout)
        }
    }

    companion object {
        fun create(
            context: Context,
            type: StackHeaderType,
        ): StackHeaderAppBarLayout =
            when (type) {
                StackHeaderType.SMALL -> Small(context)
                StackHeaderType.MEDIUM, StackHeaderType.LARGE -> Collapsing(context, type)
            }
    }
}
