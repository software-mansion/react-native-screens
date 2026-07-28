package com.swmansion.rnscreens.stack.header.appbar

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.TextView
import androidx.coordinatorlayout.widget.CoordinatorLayout
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

        // MaterialToolbar creates its title/subtitle TextViews lazily and exposes no getters.
        // We force them into existence in a fixed order (title first, subtitle second) so we can
        // hold stable references — identifying them by text is ambiguous when the title and
        // subtitle share the same string. Both instances persist for the toolbar's lifetime, so
        // these references stay valid even while the text is cleared.
        internal val titleTextView: TextView
        internal val subtitleTextView: TextView

        init {
            addView(toolbar)

            toolbar.title = FORCE_CREATE_PLACEHOLDER
            val title = toolbar.toolbarTextViews().single()
            toolbar.subtitle = FORCE_CREATE_PLACEHOLDER
            val subtitle = toolbar.toolbarTextViews().first { it !== title }
            toolbar.title = ""
            toolbar.subtitle = ""

            titleTextView = title
            subtitleTextView = subtitle
        }

        private fun MaterialToolbar.toolbarTextViews(): List<TextView> = (0 until childCount).mapNotNull { getChildAt(it) as? TextView }

        private companion object {
            // Any non-empty string forces the TextViews into existence; cleared before layout.
            private const val FORCE_CREATE_PLACEHOLDER = "\u200B"
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
