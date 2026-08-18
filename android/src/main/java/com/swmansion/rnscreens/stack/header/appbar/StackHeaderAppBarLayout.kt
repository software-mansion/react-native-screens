package com.swmansion.rnscreens.stack.header.appbar

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.TextView
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.children
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.stack.header.config.StackHeaderCollapsedTitleGravityMode
import com.swmansion.rnscreens.stack.header.config.StackHeaderType
import com.swmansion.rnscreens.utils.resolveDimensionAttr

internal sealed class StackHeaderAppBarLayout(
    context: Context,
) : AppBarLayout(context) {
    abstract val toolbar: MaterialToolbar

    internal abstract val defaultContentInsetStart: Int
    internal abstract val defaultContentInsetEnd: Int

    init {
        layoutParams =
            CoordinatorLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT).apply {
                behavior = StackHeaderAppBarLayoutBehavior()
            }

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

        override val defaultContentInsetStart: Int = toolbar.contentInsetStart
        override val defaultContentInsetEnd: Int = toolbar.contentInsetEnd

        // Setting text size and typeface separately (Toolbar exposes only a whole text appearance)
        // needs the title/subtitle TextViews, and Toolbar has no getter for them. Material locates
        // them by matching the current text (internal ToolbarUtils.getTitleTextView); we attempt
        // the same, but since we don't have current text, we use distinct placeholders - they force
        // both views into existence and tell them apart — and clear the text only after capturing
        // the references. Toolbar keeps both instances for its lifetime (empty text only detaches
        // them), so the references stay valid.
        internal val titleTextView: TextView
        internal val subtitleTextView: TextView

        init {
            addView(toolbar)

            toolbar.title = TITLE_PLACEHOLDER
            toolbar.subtitle = SUBTITLE_PLACEHOLDER
            titleTextView = toolbar.findTextViewWithText(TITLE_PLACEHOLDER)
            subtitleTextView = toolbar.findTextViewWithText(SUBTITLE_PLACEHOLDER)
            toolbar.title = ""
            toolbar.subtitle = ""
        }

        private fun MaterialToolbar.findTextViewWithText(text: String): TextView =
            children.filterIsInstance<TextView>().first { it.text?.toString() == text }

        private companion object {
            private const val TITLE_PLACEHOLDER = "rns_title"
            private const val SUBTITLE_PLACEHOLDER = "rns_subtitle"
        }
    }

    @SuppressLint("ViewConstructor")
    internal class Collapsing(
        context: Context,
        val type: StackHeaderType,
        collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityMode,
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

        override val defaultContentInsetStart: Int = toolbar.contentInsetStart
        override val defaultContentInsetEnd: Int = toolbar.contentInsetEnd

        // collapsedTitleGravityMode is a construction-time-only attr (no public setter), so both
        // gravity modes are inflated from XML — differing only in that attribute — to stay 1:1.
        internal val collapsingToolbarLayout: CollapsingToolbarLayout =
            (
                LayoutInflater
                    .from(context)
                    .inflate(layoutResFor(type, collapsedTitleGravityMode), this, false)
                    as CollapsingToolbarLayout
            ).apply { addView(toolbar) }

        init {
            require(
                type == StackHeaderType.MEDIUM ||
                    type == StackHeaderType.LARGE,
            ) {
                "[RNScreens] Collapsing StackHeaderAppBarLayout must be MEDIUM or LARGE type."
            }
            addView(collapsingToolbarLayout)
        }

        private companion object {
            fun layoutResFor(
                type: StackHeaderType,
                mode: StackHeaderCollapsedTitleGravityMode,
            ): Int =
                when (type) {
                    StackHeaderType.MEDIUM ->
                        when (mode) {
                            StackHeaderCollapsedTitleGravityMode.ENTIRE_SPACE ->
                                com.swmansion.rnscreens.R.layout.rns_collapsing_toolbar_medium_entire_space
                            StackHeaderCollapsedTitleGravityMode.AVAILABLE_SPACE ->
                                com.swmansion.rnscreens.R.layout.rns_collapsing_toolbar_medium_available_space
                        }
                    StackHeaderType.LARGE ->
                        when (mode) {
                            StackHeaderCollapsedTitleGravityMode.ENTIRE_SPACE ->
                                com.swmansion.rnscreens.R.layout.rns_collapsing_toolbar_large_entire_space
                            StackHeaderCollapsedTitleGravityMode.AVAILABLE_SPACE ->
                                com.swmansion.rnscreens.R.layout.rns_collapsing_toolbar_large_available_space
                        }
                    else -> error("[RNScreens] Invalid header mode.")
                }
        }
    }

    companion object {
        fun create(
            context: Context,
            type: StackHeaderType,
            collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityMode,
        ): StackHeaderAppBarLayout =
            when (type) {
                StackHeaderType.SMALL -> Small(context)
                StackHeaderType.MEDIUM, StackHeaderType.LARGE ->
                    Collapsing(context, type, collapsedTitleGravityMode)
            }
    }
}
