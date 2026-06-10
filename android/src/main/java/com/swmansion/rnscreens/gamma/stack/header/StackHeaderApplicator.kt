package com.swmansion.rnscreens.gamma.stack.header

import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.text.TextUtils
import android.util.Log
import android.view.Gravity
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.FrameLayout
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.AppCompatTextView
import androidx.appcompat.widget.Toolbar
import androidx.core.graphics.drawable.DrawableCompat
import androidx.core.view.MenuItemCompat
import androidx.core.widget.TextViewCompat
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_SNAP
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.ext.detachFromCurrentParent
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarUpdate
import com.swmansion.rnscreens.utils.resolveDrawableAttr

internal class StackHeaderApplicator(
    private val wrappedContext: ContextThemeWrapper,
) {
    // region Rebuild

    fun rebuild(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ): StackHeaderAppBarLayout {
        val appBar = StackHeaderAppBarLayout.create(wrappedContext, config.type)

        if (config.transparent) {
            coordinatorLayout.removeContentBehavior()
            coordinatorLayout.addView(appBar)
        } else {
            coordinatorLayout.addView(appBar, 0)
            coordinatorLayout.setContentBehavior()
        }

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

        config.leadingSubview?.let {
            it.view.detachFromCurrentParent()
            toolbar.addView(it.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.START))
        }

        config.trailingSubview?.let {
            it.view.detachFromCurrentParent()
            toolbar.addView(it.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.END))
        }

        populateTitleOrCenter(appBar, toolbar, config)
        populateBackground(appBar, config)
    }

    private fun populateTitleOrCenter(
        appBar: StackHeaderAppBarLayout,
        toolbar: Toolbar,
        config: StackHeaderConfigurationProviding,
    ) {
        val centerSubview = config.centerSubview
        if (centerSubview != null) {
            if (appBar is StackHeaderAppBarLayout.Small) {
                centerSubview.view.detachFromCurrentParent()
                toolbar.addView(centerSubview.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.CENTER_HORIZONTAL))
            } else {
                Log.e(TAG, "[RNScreens] Center subview is supported only for small header type.")
            }
        } else if (appBar is StackHeaderAppBarLayout.Small) {
            val titleView = createManagedTitleView(toolbar)
            appBar.managedTitleView = titleView
            val index = if (config.isRTL) 0 else -1
            toolbar.addView(titleView, index, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.START))
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

        backgroundSubview.view.detachFromCurrentParent()
        val wrapper =
            FrameLayout(appBar.context).apply {
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

    private fun createManagedTitleView(toolbar: Toolbar): AppCompatTextView =
        AppCompatTextView(toolbar.context).apply {
            setSingleLine()
            ellipsize = TextUtils.TruncateAt.END
            TextViewCompat.setTextAppearance(
                this,
                R.style.TextAppearance_Material3_TitleLarge,
            )
            layoutParams =
                Toolbar
                    .LayoutParams(
                        WRAP_CONTENT,
                        WRAP_CONTENT,
                        Gravity.START,
                    ).apply {
                        marginStart = toolbar.titleMarginStart + toolbar.contentInsetStart
                        marginEnd = toolbar.titleMarginEnd
                        topMargin = toolbar.titleMarginTop
                        bottomMargin = toolbar.titleMarginBottom
                    }
        }

    // endregion

    // region In-place updates

    fun applyTitle(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                appBar.managedTitleView?.text = config.title
                appBar.managedTitleView?.requestLayout()
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                appBar.collapsingToolbarLayout.title = config.title
            }
        }
    }

    fun applyBackButton(
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

        val tintList = resolveBackButtonTintList(config)
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

    fun applyScrollFlags(
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
        appBar.setExpanded(true, false)
    }

    // endregion

    // region Toolbar menu

    fun rebuildToolbarMenu(
        toolbar: MaterialToolbar,
        items: List<StackHeaderToolbarMenuItemConfig>,
        onItemClicked: (id: String) -> Unit,
    ): Pair<Map<String, Int>, Map<Int, String>> {
        toolbar.menu.clear()

        val forwardIdMap = mutableMapOf<String, Int>()
        val reverseIdMap = mutableMapOf<Int, String>()

        items.forEachIndexed { index, item ->
            val nativeId = index + 1
            forwardIdMap[item.id] = nativeId
            reverseIdMap[nativeId] = item.id
            val menuItem = toolbar.menu.add(Menu.NONE, nativeId, index, null)
            applyMenuItemOptions(toolbar, menuItem, item.toOptions())
        }

        toolbar.setOnMenuItemClickListener { menuItem ->
            reverseIdMap[menuItem.itemId]?.let(onItemClicked)
            true
        }

        return Pair(forwardIdMap.toMap(), reverseIdMap.toMap())
    }

    fun updateToolbarMenuItem(
        toolbar: MaterialToolbar,
        forwardIdMap: Map<String, Int>,
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        val item =
            forwardIdMap[id]?.let { toolbar.menu.findItem(it) } ?: run {
                Log.e(TAG, "[RNScreens] Unable to find menu item.")
                return
            }
        applyMenuItemOptions(toolbar, item, options)
    }

    private fun applyMenuItemOptions(
        toolbar: MaterialToolbar,
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        options.title?.let { menuItem.title = it }
        options.hidden?.let { menuItem.isVisible = !it }
        options.showAsAction?.let { menuItem.setShowAsAction(it.toNativeShowAsAction()) }

        options.icon?.let {
            when (it) {
                StackHeaderToolbarUpdate.Reset -> menuItem.icon = null
                is StackHeaderToolbarUpdate.Set<Drawable> ->
                    menuItem.icon = getResizedDrawable(toolbar, it.value)
            }
        }

        if (options.requiresIconTintColorUpdate || options.icon != null) {
            MenuItemCompat.setIconTintList(menuItem, getResolvedIconTintList(menuItem, options))
        }
    }

    private fun StackHeaderToolbarMenuItemConfig.toOptions() =
        StackHeaderToolbarMenuItemOptions(
            title = title,
            hidden = hidden,
            showAsAction = showAsAction,
            icon = StackHeaderToolbarUpdate.from(icon),
            iconTintColorNormal = StackHeaderToolbarUpdate.from(iconTintColorNormal),
            iconTintColorPressed = StackHeaderToolbarUpdate.from(iconTintColorPressed),
            iconTintColorFocused = StackHeaderToolbarUpdate.from(iconTintColorFocused),
            iconTintColorDisabled = StackHeaderToolbarUpdate.from(iconTintColorDisabled),
        )

    private fun getResolvedIconTintList(
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuItemOptions,
    ): ColorStateList? {
        val currentTintList = MenuItemCompat.getIconTintList(menuItem)
        val currentNormal = currentTintList?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled))

        val finalNormal =
            when (val update = options.iconTintColorNormal) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null -> currentNormal
            }

        val finalDisabled =
            when (val update = options.iconTintColorDisabled) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(-android.R.attr.state_enabled))
                        ?.takeIf { it != currentNormal }
            }

        val finalPressed =
            when (val update = options.iconTintColorPressed) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled, android.R.attr.state_pressed))
                        ?.takeIf { it != currentNormal }
            }

        val finalFocused =
            when (val update = options.iconTintColorFocused) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled, android.R.attr.state_focused))
                        ?.takeIf { it != currentNormal }
            }

        val states = mutableListOf<IntArray>()
        val colors = mutableListOf<Int>()

        finalDisabled?.let {
            states.add(intArrayOf(-android.R.attr.state_enabled))
            colors.add(it)
        }

        finalPressed?.let {
            states.add(intArrayOf(android.R.attr.state_pressed))
            colors.add(it)
        }

        finalFocused?.let {
            states.add(intArrayOf(android.R.attr.state_focused))
            colors.add(it)
        }

        finalNormal?.let {
            states.add(intArrayOf())
            colors.add(it)
        }

        return if (states.isNotEmpty()) {
            ColorStateList(states.toTypedArray(), colors.toIntArray())
        } else {
            null
        }
    }

    private fun ColorStateList.resolvedColorOrNull(stateSet: IntArray): Int? {
        val a = getColorForState(stateSet, SENTINEL_A)
        val b = getColorForState(stateSet, SENTINEL_B)
        return if (a == b) a else null
    }

    // endregion

    // region Helpers

    private fun resolveBackButtonTintList(config: StackHeaderConfigurationProviding): ColorStateList? {
        val normal = config.backButtonTintColorNormal
        val pressed = config.backButtonTintColorPressed
        val focused = config.backButtonTintColorFocused

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

    private fun resolveDefaultBackButtonIcon(): Drawable? =
        resolveDrawableAttr(wrappedContext, androidx.appcompat.R.attr.homeAsUpIndicator)

    private fun maybeApplyRTLCollapsingToolbarLayoutWorkaround(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
        appBar: StackHeaderAppBarLayout,
    ) {
        if (appBar is StackHeaderAppBarLayout.Collapsing && config.isRTL) {
            appBar.measure(
                View.MeasureSpec.makeMeasureSpec(coordinatorLayout.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
            )
            moveDummyViewToFront(appBar.toolbar)
        }
    }

    private fun moveDummyViewToFront(toolbar: Toolbar) {
        for (i in 0 until toolbar.childCount) {
            val child = toolbar.getChildAt(i)
            if (child !is StackHeaderSubview) {
                val lp = child.layoutParams
                toolbar.removeViewAt(i)
                toolbar.addView(child, 0, lp)
                return
            }
        }
    }

    // endregion

    companion object {
        private const val TAG = "StackHeaderApplicator"

        private const val SENTINEL_A = 0x00000001
        private const val SENTINEL_B = 0x00000002
    }
}
