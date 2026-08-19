package com.swmansion.rnscreens.stack.header

import android.annotation.SuppressLint
import android.content.res.ColorStateList
import android.graphics.Typeface
import android.graphics.drawable.Drawable
import android.util.Log
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.FrameLayout
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.AppCompatImageView
import androidx.appcompat.widget.Toolbar
import androidx.core.graphics.drawable.DrawableCompat
import androidx.core.graphics.drawable.toDrawable
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_SNAP
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.common.text.TextAppearance
import com.swmansion.rnscreens.common.text.TextAppearanceDefaults
import com.swmansion.rnscreens.ext.detachFromCurrentParent
import com.swmansion.rnscreens.stack.header.appbar.StackHeaderAppBarLayout
import com.swmansion.rnscreens.stack.header.config.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.stack.header.config.StackHeaderType
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.utils.dpToPx
import com.swmansion.rnscreens.utils.resolveColorAttr
import com.swmansion.rnscreens.utils.resolveDrawableAttr
import com.swmansion.rnscreens.utils.spToPx
import kotlin.math.roundToInt

/**
 * Builds and applies the Material app bar — type, subviews, title, back button,
 * scroll flags — from the header configuration.
 */
internal class StackHeaderApplicator(
    private val wrappedContext: ContextThemeWrapper,
) {
    // region Rebuild

    internal fun rebuild(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ): StackHeaderAppBarLayout {
        val appBar =
            StackHeaderAppBarLayout.create(
                wrappedContext,
                config.type,
                config.collapsedTitleGravityMode,
            )

        if (config.transparent) {
            coordinatorLayout.removeContentBehavior()
            coordinatorLayout.addView(appBar)
        } else {
            coordinatorLayout.addView(appBar, 0)
            coordinatorLayout.setContentBehavior()
        }

        // Make sure that we receive insets, necessary when changing header mode in runtime.
        appBar.requestApplyInsets()
        populateAppBar(appBar, config)
        maybeApplyRTLCollapsingToolbarLayoutWorkaround(coordinatorLayout, config, appBar)
        appBar.toolbar.requestLayout()

        return appBar
    }

    // endregion

    // region App bar population

    private fun populateAppBar(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val toolbar = appBar.toolbar

        // Toolbar measures children in insertion order. Leading and trailing go first so the
        // title/center gets the remaining space.
        config.leadingSubview?.let {
            it.view.detachFromCurrentParent()
            toolbar.addView(it.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.START))
        }

        config.trailingSubview?.let {
            it.view.detachFromCurrentParent()
            toolbar.addView(it.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.END))
        }

        populateCenterSubview(appBar, toolbar, config)
        populateBackground(appBar, config)
    }

    private fun populateCenterSubview(
        appBar: StackHeaderAppBarLayout,
        toolbar: Toolbar,
        config: StackHeaderConfigurationProviding,
    ) {
        val centerSubview = config.centerSubview ?: return
        if (appBar is StackHeaderAppBarLayout.Small) {
            centerSubview.view.detachFromCurrentParent()
            toolbar.addView(centerSubview.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.CENTER_HORIZONTAL))
        } else {
            Log.e(TAG, "[RNScreens] Center subview is supported only for small header type.")
        }
    }

    private fun populateBackground(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val backgroundSubview = config.backgroundSubview ?: return

        if (appBar !is StackHeaderAppBarLayout.Collapsing) {
            Log.e(TAG, "[RNScreens] Background subview is supported only for collapsing header types (medium, large).")
            return
        }

        // Wrap in a FrameLayout so that CollapsingToolbarLayout's ViewOffsetHelper attaches to
        // the disposable wrapper, not the reused React view. This avoids stale parallax offsets
        // persisting across collapse mode rebuilds therefore allowing runtime changes to this
        // property.
        backgroundSubview.view.detachFromCurrentParent()
        val wrapper =
            FrameLayout(appBar.context).apply {
                // We're setting `fitsSystemWindows` so that the background renders behind
                // status bar (edge-to-edge).
                fitsSystemWindows = true
                addView(backgroundSubview.view, FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT))
            }

        appBar.collapsingToolbarLayout.addView(
            wrapper,
            0,
            CollapsingToolbarLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT).apply {
                collapseMode = backgroundSubview.collapseMode.toNativeCollapseMode()
            },
        )
    }

    // endregion

    // region In-place updates

    // ctl.setMaxLines() is listed in Material docs in the same way as other props but for some
    // reason it's restricted.
    @SuppressLint("RestrictedApi")
    internal fun applyTitleAndSubtitle(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
        isAppBarFullyCollapsed: Boolean,
    ) {
        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                appBar.toolbar.title = config.title
                appBar.toolbar.subtitle = config.subtitle
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                val ctl = appBar.collapsingToolbarLayout

                ctl.maxLines = config.maxLines

                ctl.title = config.title
                ctl.subtitle = config.subtitle

                // setText only recomputes draw offsets within the existing bounds; the
                // title/subtitle vertical split is recomputed only in onLayout. Force a layout
                // so toggling the subtitle at runtime reclaims the title space.
                ctl.requestLayout()

                // Material re-asserts the collapsed offset after a height change itself, but only
                // when maxLines > 1 (CollapsingToolbarLayout.onMeasure). With maxLines == 1 it never
                // does, so toggling the subtitle at runtime while collapsed leaves a stale offset —
                // setExpanded(false, false) is the closest public equivalent of Material's private
                // maybeSetPendingActionCollapsed().
                if (config.maxLines == 1 && isAppBarFullyCollapsed) {
                    appBar.setExpanded(false, false)
                }
            }
        }
    }

    internal fun applyTitlePositioning(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                appBar.toolbar.isTitleCentered = config.titleCentered
                appBar.toolbar.isSubtitleCentered = config.subtitleCentered
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                appBar.collapsingToolbarLayout.expandedTitleGravity =
                    config.expandedTitleHorizontalGravity or config.expandedTitleVerticalGravity
                appBar.collapsingToolbarLayout.collapsedTitleGravity =
                    config.collapsedTitleHorizontalGravity or config.collapsedTitleVerticalGravity
            }
        }
    }

    internal fun applyTitleAndSubtitleAppearance(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                val toolbar = appBar.toolbar

                // Widget.Material3Expressive.Toolbar#{title,subtitle}TextAppearance
                //   = @macro/m3_comp_app_bar_small_{title,subtitle}_font. That style sets no text
                //   colors, so both come from @macro/m3_comp_app_bar_{title,subtitle}_color.
                applySlot(
                    view = toolbar,
                    defaults =
                        TextAppearanceDefaults.resolve(
                            toolbar.context,
                            R.attr.textAppearanceTitleLarge,
                            R.attr.colorOnSurface,
                        ),
                    appearance = config.titleAppearance,
                    setColor = { toolbar.setTitleTextColor(it) },
                    setTypeface = { appBar.titleTextView.typeface = it },
                    setTextSizePx = { appBar.titleTextView.setTextSize(TypedValue.COMPLEX_UNIT_PX, it) },
                )
                applySlot(
                    view = toolbar,
                    defaults =
                        TextAppearanceDefaults.resolve(
                            toolbar.context,
                            R.attr.textAppearanceLabelMedium,
                            R.attr.colorOnSurfaceVariant,
                        ),
                    appearance = config.subtitleAppearance,
                    setColor = { toolbar.setSubtitleTextColor(it) },
                    setTypeface = { appBar.subtitleTextView.typeface = it },
                    setTextSizePx = { appBar.subtitleTextView.setTextSize(TypedValue.COMPLEX_UNIT_PX, it) },
                )
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                val ctl = appBar.collapsingToolbarLayout
                val isLarge = appBar.type == StackHeaderType.LARGE

                // Widget.Material3Expressive.CollapsingToolbar.{Large,Medium}#expandedTitleTextAppearance
                //   = @macro/m3_comp_app_bar_{large,medium}_flexible_title_font
                val expandedTitleAttr =
                    if (isLarge) R.attr.textAppearanceDisplaySmall else R.attr.textAppearanceHeadlineMedium

                // …#expandedSubtitleTextAppearance
                //   = @macro/m3_comp_app_bar_{large,medium}_flexible_subtitle_font
                val expandedSubtitleAttr =
                    if (isLarge) R.attr.textAppearanceTitleMedium else R.attr.textAppearanceLabelLarge

                // In the calls below, the collapsed appearances and all four colors come from the base
                // Widget.Material3Expressive.CollapsingToolbar: collapsed{Title,Subtitle}TextAppearance
                //   = @macro/m3_comp_app_bar_small_{title,subtitle}_font,
                // {collapsed,expanded}{Title,Subtitle}TextColor
                //   = @macro/m3_comp_app_bar_{title,subtitle}_color.

                applySlot(
                    view = ctl,
                    defaults =
                        TextAppearanceDefaults.resolve(ctl.context, expandedTitleAttr, R.attr.colorOnSurface),
                    appearance = config.expandedTitleAppearance,
                    setColor = { ctl.setExpandedTitleTextColor(ColorStateList.valueOf(it)) },
                    setTypeface = { ctl.setExpandedTitleTypeface(it) },
                    setTextSizePx = { ctl.expandedTitleTextSize = it },
                )
                applySlot(
                    view = ctl,
                    defaults =
                        TextAppearanceDefaults.resolve(ctl.context, R.attr.textAppearanceTitleLarge, R.attr.colorOnSurface),
                    appearance = config.collapsedTitleAppearance,
                    setColor = { ctl.setCollapsedTitleTextColor(it) },
                    setTypeface = { ctl.setCollapsedTitleTypeface(it) },
                    setTextSizePx = { ctl.collapsedTitleTextSize = it },
                )
                applySlot(
                    view = ctl,
                    defaults =
                        TextAppearanceDefaults.resolve(ctl.context, expandedSubtitleAttr, R.attr.colorOnSurfaceVariant),
                    appearance = config.expandedSubtitleAppearance,
                    setColor = { ctl.setExpandedSubtitleTextColor(ColorStateList.valueOf(it)) },
                    setTypeface = { ctl.setExpandedSubtitleTypeface(it) },
                    setTextSizePx = { ctl.expandedSubtitleTextSize = it },
                )
                applySlot(
                    view = ctl,
                    defaults =
                        TextAppearanceDefaults.resolve(ctl.context, R.attr.textAppearanceLabelMedium, R.attr.colorOnSurfaceVariant),
                    appearance = config.collapsedSubtitleAppearance,
                    setColor = { ctl.setCollapsedSubtitleTextColor(it) },
                    setTypeface = { ctl.setCollapsedSubtitleTypeface(it) },
                    setTextSizePx = { ctl.collapsedSubtitleTextSize = it },
                )

                // Layout is necessary e.g. after changing subtitle text size.
                ctl.requestLayout()
            }
        }
    }

    /**
     * Applies one title/subtitle slot as absolute values: each property is the prop value when
     * set, the Material default otherwise.
     */
    private fun applySlot(
        view: View,
        defaults: TextAppearanceDefaults,
        appearance: TextAppearance,
        setColor: (Int) -> Unit,
        setTypeface: (Typeface) -> Unit,
        setTextSizePx: (Float) -> Unit,
    ) {
        setColor(appearance.color ?: defaults.color)
        setTypeface(appearance.resolveTypeface(defaults.typeface))
        setTextSizePx(appearance.fontSize?.let { view.spToPx(it) } ?: defaults.textSizePx)
    }

    internal fun applyContentInsets(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val toolbar = appBar.toolbar

        toolbar.setContentInsetsRelative(
            config.contentInsetStart?.let { toolbar.dpToPx(it).roundToInt() } ?: appBar.defaultContentInsetStart,
            config.contentInsetEnd?.let { toolbar.dpToPx(it).roundToInt() } ?: appBar.defaultContentInsetEnd,
        )

        toolbar.requestLayout()
    }

    internal fun applyBackButton(
        toolbar: MaterialToolbar,
        config: StackHeaderConfigurationProviding,
        canNavigateBack: Boolean,
        onNavigationIconClick: () -> Unit,
    ) {
        val visible = canNavigateBack && !config.backButtonHidden

        if (!visible) {
            toolbar.navigationIcon = null
            toolbar.setNavigationOnClickListener(null)
            return
        }

        toolbar.clearNavigationIconTint()

        val baseDrawable =
            config.backButtonIcon
                ?.let { getResizedDrawable(toolbar, it) }
                ?: resolveDefaultBackButtonIcon()

        val tintList =
            buildTintList(
                config.backButtonTintColorNormal,
                config.backButtonTintColorPressed,
                config.backButtonTintColorFocused,
            )

        toolbar.navigationIcon =
            if (tintList != null && baseDrawable != null) {
                DrawableCompat.wrap(baseDrawable.mutate()).also {
                    DrawableCompat.setTintList(it, tintList)
                }
            } else {
                baseDrawable
            }

        toolbar.setNavigationOnClickListener { onNavigationIconClick() }
    }

    internal fun applyOverflowIcon(
        toolbar: MaterialToolbar,
        config: StackHeaderConfigurationProviding,
    ) {
        val baseDrawable =
            config.overflowIcon
                ?.let { getResizedDrawable(toolbar, it) }
                ?: resolveDefaultOverflowIcon()

        val tintList =
            buildTintList(
                config.overflowIconTintColorNormal,
                config.overflowIconTintColorPressed,
                config.overflowIconTintColorFocused,
            )

        toolbar.overflowIcon =
            if (tintList != null && baseDrawable != null) {
                DrawableCompat.wrap(baseDrawable.mutate()).also {
                    DrawableCompat.setTintList(it, tintList)
                }
            } else {
                baseDrawable
            }
    }

    internal fun applyScrollFlags(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        warnInvalidScrollFlagCombinations(config)

        val desired = computeScrollFlags(config)
        val target: View =
            when (appBar) {
                is StackHeaderAppBarLayout.Small -> appBar.toolbar
                is StackHeaderAppBarLayout.Collapsing -> appBar.collapsingToolbarLayout
            }
        val params = target.layoutParams as AppBarLayout.LayoutParams
        params.scrollFlags = desired
        target.layoutParams = params
        // Snap back to expanded so the visible state matches the new flags.
        appBar.setExpanded(true, false)
    }

    /**
     * Applies lift-on-scroll in-place. `setLiftOnScroll` is a plain field
     * setter (re-read on the next layout / nested-scroll pass), so this needs
     * no header rebuild.
     *
     * Only the small header participates: medium/large (collapsing) headers
     * derive their elevation from the `CollapsingToolbarLayout` content scrim,
     * not from lift-on-scroll, so we leave their app bar untouched.
     *
     * [targetScrollView] is the resolved content scroll view (see
     * [com.swmansion.rnscreens.common.container.ContainerItem.findContentScrollView]).
     * Without it, Material's `findFirstScrollingChild` only inspects the
     * CoordinatorLayout's direct children — which is our wrapper `FrameLayout`,
     * not the (deeply nested) scroll view — so the lifted state is miscomputed
     * and the small header flashes while scrolling.
     */
    internal fun applyLiftOnScroll(
        appBar: StackHeaderAppBarLayout,
        enabled: Boolean,
        targetScrollView: ViewGroup?,
    ) {
        if (appBar !is StackHeaderAppBarLayout.Small) return

        appBar.isLiftOnScroll = enabled
        appBar.setLiftOnScrollTargetView(if (enabled) targetScrollView else null)
        appBar.requestLayout()
    }

    internal fun applyBackgroundColors(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val backgroundColor =
            config.backgroundColor ?: resolveColorAttr(appBar.context, R.attr.colorSurface)
        val scrolledBackgroundColor =
            config.scrolledBackgroundColor
                ?: resolveColorAttr(appBar.context, R.attr.colorSurfaceContainer)

        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                appBar.background = backgroundColor.toDrawable()
                appBar.setLiftOnScrollColor(ColorStateList.valueOf(scrolledBackgroundColor))
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                appBar.setLiftOnScrollColor(null)
                appBar.background = backgroundColor.toDrawable()
                appBar.collapsingToolbarLayout.setContentScrimColor(scrolledBackgroundColor)
            }
        }
    }

    // endregion

    // region Helpers

    private fun computeScrollFlags(config: StackHeaderConfigurationProviding): Int {
        var flags = 0
        if (config.scrollFlagScroll) flags = flags or SCROLL_FLAG_SCROLL
        if (config.scrollFlagEnterAlways) flags = flags or SCROLL_FLAG_ENTER_ALWAYS
        if (config.scrollFlagEnterAlwaysCollapsed) flags = flags or SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED
        if (config.scrollFlagExitUntilCollapsed) flags = flags or SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
        if (config.scrollFlagSnap) flags = flags or SCROLL_FLAG_SNAP
        return flags
    }

    private fun warnInvalidScrollFlagCombinations(config: StackHeaderConfigurationProviding) {
        val anyDependentFlag =
            config.scrollFlagEnterAlways ||
                config.scrollFlagEnterAlwaysCollapsed ||
                config.scrollFlagExitUntilCollapsed ||
                config.scrollFlagSnap
        if (anyDependentFlag && !config.scrollFlagScroll) {
            Log.e(TAG, "[RNScreens] scrollFlag* requires scrollFlagScroll to take effect.")
        }
        if (config.scrollFlagEnterAlwaysCollapsed && !config.scrollFlagEnterAlways) {
            Log.e(TAG, "[RNScreens] scrollFlagEnterAlwaysCollapsed requires scrollFlagEnterAlways to take effect.")
        }
    }

    private fun resolveDefaultBackButtonIcon(): Drawable? = resolveDrawableAttr(wrappedContext, androidx.appcompat.R.attr.homeAsUpIndicator)

    // Mirrors how the toolbar's own overflow button obtains its icon: an AppCompatImageView built
    // with actionOverflowButtonStyle resolves the theme's srcCompat and applies AppCompat's
    // colorControlNormal auto-tint.
    private fun resolveDefaultOverflowIcon(): Drawable? =
        AppCompatImageView(wrappedContext, null, androidx.appcompat.R.attr.actionOverflowButtonStyle).drawable

    private fun maybeApplyRTLCollapsingToolbarLayoutWorkaround(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
        appBar: StackHeaderAppBarLayout,
    ) {
        // For collapsing headers, CTL lazily adds a MATCH_PARENT dummy view to the Toolbar
        // during the first onMeasure (ensureToolbar). We need our subviews at higher indices
        // than the dummy view so they get positioned first in RTL layout. Forcing a measure
        // triggers the dummy view creation.
        if (appBar is StackHeaderAppBarLayout.Collapsing && config.isRTL) {
            appBar.measure(
                View.MeasureSpec.makeMeasureSpec(coordinatorLayout.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
            )
            moveDummyViewToFront(appBar.toolbar)
        }
    }

    /**
     * CollapsingToolbarLayout adds a MATCH_PARENT dummy view to the Toolbar for title bounds
     * tracking. In RTL, the Toolbar iterates custom views in reverse child order — so the
     * dummy view (if last) gets processed first and consumes the entire layout cursor.
     * Moving it to index 0 ensures our subviews are processed first.
     *
     * See https://github.com/material-components/material-components-android/issues/1867.
     */
    private fun moveDummyViewToFront(toolbar: Toolbar) {
        for (i in 0 until toolbar.childCount) {
            val child = toolbar.getChildAt(i)
            // Assumes only StackHeaderSubview children exist in Collapsing toolbar besides
            // the CTL dummy view.
            if (child !is StackHeaderSubview) {
                val lp = child.layoutParams
                toolbar.removeViewAt(i)
                toolbar.addView(child, 0, lp)
                return
            }
        }
    }

    private fun buildTintList(
        normal: Int?,
        pressed: Int?,
        focused: Int?,
    ): ColorStateList? {
        if (normal == null && pressed == null && focused == null) return null

        val states = mutableListOf<IntArray>()
        val colors = mutableListOf<Int>()

        pressed?.let {
            states.add(intArrayOf(android.R.attr.state_pressed))
            colors.add(it)
        }
        focused?.let {
            states.add(intArrayOf(android.R.attr.state_focused))
            colors.add(it)
        }
        normal?.let {
            states.add(intArrayOf())
            colors.add(it)
        }

        return ColorStateList(states.toTypedArray(), colors.toIntArray())
    }

    // endregion

    companion object {
        private const val TAG = "StackHeaderApplicator"
    }
}
