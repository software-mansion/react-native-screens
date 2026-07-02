package com.swmansion.rnscreens.gamma.stack.header

import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.os.Build
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
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuElementConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuElementOptions
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuGroupConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuGroupMetadata
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemType
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarUpdate
import com.swmansion.rnscreens.gamma.stack.header.toolbar.valueOrNull
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
            // Small header needs a managed title view because we can't use Toolbar's native
            // title — it would be laid out to the leading side of leading subview.
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
                        // TODO: there seems to be a problem with collapsing margins.
                        //       We will expose customization either way but we should
                        //       have consistent behavior and defaults.
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
        // Snap back to expanded so the visible state matches the new flags.
        appBar.setExpanded(true, false)
    }

    // endregion

    // region Toolbar menu

    fun generateToolbarMenuItemMappings(menuConfig: StackHeaderToolbarMenuConfig): Pair<Map<String, Int>, Map<Int, String>> {
        val forwardIdMap = mutableMapOf<String, Int>()
        val reverseIdMap = mutableMapOf<Int, String>()
        var counter = 1
        assignElementIds(menuConfig.children, forwardIdMap, reverseIdMap) { counter++ }
        return Pair(forwardIdMap.toMap(), reverseIdMap.toMap())
    }

    fun generateToolbarMenuGroupMappings(menuConfig: StackHeaderToolbarMenuConfig): Map<String, Int> {
        val forwardGroupIdMap = mutableMapOf<String, Int>()
        var counter = 1
        assignGroupIds(menuConfig, forwardGroupIdMap) { counter++ }
        return forwardGroupIdMap.toMap()
    }

    fun computeGroupMetadata(menuConfig: StackHeaderToolbarMenuConfig): StackHeaderToolbarMenuGroupMetadata {
        val itemGroupMap = mutableMapOf<String, String>()
        val groupSingleSelection = mutableMapOf<String, Boolean>()
        val groupMemberItems = mutableMapOf<String, MutableList<String>>()
        collectGroupMetadata(menuConfig, itemGroupMap, groupSingleSelection, groupMemberItems)
        return StackHeaderToolbarMenuGroupMetadata(
            itemGroupMap,
            groupSingleSelection,
            groupMemberItems.mapValues { it.value.toList() },
        )
    }

    fun validateRadioInitialSelection(menuConfig: StackHeaderToolbarMenuConfig) {
        for (group in menuConfig.groups) {
            if (!group.singleSelection) continue
            var count = 0
            for (element in menuConfig.children) {
                if (element.item.groupId == group.groupId && element.item.initialToggleState) {
                    count++
                }
            }
            require(count <= 1) {
                "[RNScreens] Radio group '${group.groupId}' has $count items with " +
                    "initialToggleState=true. At most 1 is allowed for single-selection groups."
            }
        }
        for (element in menuConfig.children) {
            if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
                validateRadioInitialSelection(element.menu)
            }
        }
    }

    /**
     * Recursively traverses menu elements and maps user-friendly string item IDs to integers
     * expected by Android.
     *
     * @param elements List of menu elements.
     * @param forwardIdMap Reference to String->Int ID map to which ID entries will be added.
     * @param reverseIdMap Reference to Int->String ID map to which ID entries will be added.
     * @param nextId Function that returns next ID integer. New unique integer should be returned
     *               each time the function is called. The function is used to handle recursive
     *               element traversal.
     */
    private fun assignElementIds(
        elements: List<StackHeaderToolbarMenuElementConfig>,
        forwardIdMap: MutableMap<String, Int>,
        reverseIdMap: MutableMap<Int, String>,
        nextId: () -> Int,
    ) {
        for (element in elements) {
            require(element.item.id !in forwardIdMap) {
                "[RNScreens] Duplicate toolbar menu item id: '${element.item.id}'. Item IDs must be unique across the entire menu."
            }
            val nativeId = nextId()
            forwardIdMap[element.item.id] = nativeId
            reverseIdMap[nativeId] = element.item.id
            if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
                assignElementIds(element.menu.children, forwardIdMap, reverseIdMap, nextId)
            }
        }
    }

    /**
     * Recursively traverses menu elements and maps user-friendly string group IDs to integers
     * expected by Android.
     *
     * @param elements List of menu elements.
     * @param forwardIdMap Reference to String->Int ID map to which ID entries will be added.
     * @param reverseIdMap Reference to Int->String ID map to which ID entries will be added.
     * @param nextId Function that returns next ID integer. New unique integer should be returned
     *               each time the function is called. The function is used to handle recursive
     *               element traversal.
     */
    private fun assignGroupIds(
        menuConfig: StackHeaderToolbarMenuConfig,
        forwardMap: MutableMap<String, Int>,
        nextId: () -> Int,
    ) {
        for (group in menuConfig.groups) {
            require(group.groupId !in forwardMap) {
                "[RNScreens] Duplicate toolbar menu group id: '${group.groupId}'. Group IDs must be unique across the entire menu."
            }
            forwardMap[group.groupId] = nextId()
        }
        for (element in menuConfig.children) {
            if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
                assignGroupIds(element.menu, forwardMap, nextId)
            }
        }
    }

    private fun collectGroupMetadata(
        config: StackHeaderToolbarMenuConfig,
        itemGroupMap: MutableMap<String, String>,
        groupSingleSelection: MutableMap<String, Boolean>,
        groupMemberItems: MutableMap<String, MutableList<String>>,
    ) {
        val localGroupIds = config.groups.map { it.groupId }.toSet()
        for (group in config.groups) {
            groupSingleSelection[group.groupId] = group.singleSelection
            groupMemberItems.getOrPut(group.groupId) { mutableListOf() }
        }
        for (element in config.children) {
            element.item.groupId?.let { gid ->
                require(gid in localGroupIds) {
                    "[RNScreens] Menu item '${element.item.id}' references group '$gid' " +
                        "which is not defined at the same menu level. " +
                        "Groups cannot span submenus."
                }
                itemGroupMap[element.item.id] = gid
                groupMemberItems[gid]!!.add(element.item.id)
            }
            if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
                collectGroupMetadata(element.menu, itemGroupMap, groupSingleSelection, groupMemberItems)
            }
        }
    }

    fun rebuildToolbarMenu(
        toolbar: MaterialToolbar,
        menuConfig: StackHeaderToolbarMenuConfig,
        forwardIdMap: Map<String, Int>,
        reverseIdMap: Map<Int, String>,
        forwardGroupIdMap: Map<String, Int>,
        groupDividerEnabled: Boolean,
        onItemClicked: (id: String, menuItem: MenuItem) -> Unit,
    ) {
        toolbar.menu.clear()
        addElements(toolbar, toolbar.menu, menuConfig, forwardIdMap, forwardGroupIdMap)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            toolbar.menu.setGroupDividerEnabled(groupDividerEnabled)
        }
        toolbar.setOnMenuItemClickListener { menuItem ->
            val stringId = reverseIdMap[menuItem.itemId]
            if (stringId != null) {
                onItemClicked(stringId, menuItem)
            }
            true
        }
    }

    private fun addElements(
        toolbar: MaterialToolbar,
        menu: Menu,
        menuConfig: StackHeaderToolbarMenuConfig,
        forwardIdMap: Map<String, Int>,
        forwardGroupIdMap: Map<String, Int>,
    ) {
        menuConfig.children.forEachIndexed { index, element ->
            val itemId =
                requireNotNull(forwardIdMap[element.item.id]) {
                    "[RNScreens] Invalid forwardIdMap received. Missing item: ${element.item}."
                }
            val groupIntId =
                element.item.groupId
                    ?.let { forwardGroupIdMap[it] ?: Menu.NONE }
                    ?: Menu.NONE
            when (element) {
                is StackHeaderToolbarMenuElementConfig.MenuItem -> {
                    val menuItem = menu.add(groupIntId, itemId, index, null)
                    applyMenuElementOptions(toolbar, menuItem, element.item.toOptions())
                    applyCheckability(menuItem, element.item)
                }
                is StackHeaderToolbarMenuElementConfig.Submenu -> {
                    val subMenu = menu.addSubMenu(groupIntId, itemId, index, null)
                    applyMenuElementOptions(toolbar, subMenu.item, element.item.toOptions())
                    element.menuTitle?.let { subMenu.setHeaderTitle(it) }
                    addElements(toolbar, subMenu, element.menu, forwardIdMap, forwardGroupIdMap)
                }
            }
        }
        configureGroupCheckability(menu, menuConfig.groups, forwardGroupIdMap)
    }

    private fun configureGroupCheckability(
        menu: Menu,
        groups: List<StackHeaderToolbarMenuGroupConfig>,
        forwardGroupIdMap: Map<String, Int>,
    ) {
        for (group in groups) {
            val groupIntId = forwardGroupIdMap[group.groupId] ?: continue
            menu.setGroupCheckable(groupIntId, true, group.singleSelection)
        }
    }

    private fun applyCheckability(
        menuItem: MenuItem,
        itemConfig: StackHeaderToolbarMenuItemConfig,
    ) {
        val shouldBeCheckable =
            when (itemConfig.itemType) {
                StackHeaderToolbarMenuItemType.TOGGLE -> {
                    require(itemConfig.groupId != null) {
                        "[RNScreens] Menu item '${itemConfig.id}' has itemType=TOGGLE but no groupId. " +
                            "Toggle items must belong to a group."
                    }
                    true
                }
                StackHeaderToolbarMenuItemType.AUTOMATIC -> itemConfig.groupId != null
                StackHeaderToolbarMenuItemType.ACTION -> {
                    require(itemConfig.groupId == null) {
                        "[RNScreens] Menu item '${itemConfig.id}' has itemType=ACTION " +
                            "and belongs to a group. Action items cannot belong to groups."
                    }
                    false
                }
            }
        if (shouldBeCheckable) {
            menuItem.isCheckable = true
            menuItem.isChecked = itemConfig.initialToggleState
        }
    }

    fun updateToolbarMenuElement(
        toolbar: MaterialToolbar,
        forwardIdMap: Map<String, Int>,
        id: String,
        options: StackHeaderToolbarMenuElementOptions,
    ) {
        val item =
            forwardIdMap[id]?.let { toolbar.menu.findItem(it) } ?: run {
                Log.e(TAG, "[RNScreens] Unable to find menu element.")
                return
            }
        applyMenuElementOptions(toolbar, item, options)
    }

    private fun applyMenuElementOptions(
        toolbar: MaterialToolbar,
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuElementOptions,
    ) {
        options.title?.let { menuItem.title = it.valueOrNull() }
        options.titleCondensed?.let { menuItem.titleCondensed = it.valueOrNull() }
        options.tooltipText?.let { MenuItemCompat.setTooltipText(menuItem, it.valueOrNull()) }
        options.hidden?.let { menuItem.isVisible = !it }
        options.disabled?.let { menuItem.isEnabled = !it }
        options.showAsAction?.let { menuItem.setShowAsAction(it.toNativeShowAsAction()) }

        // checked is intentionally not handled here. The coordinator layout manages it in
        // handleGroupItemStateChange because toggling checked state requires group metadata
        // (radio vs checkbox) and may emit onGroupSelectionChanged events.

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

        options.menuTitle?.let { update ->
            val subMenu = menuItem.subMenu
            if (subMenu != null) {
                // In order to match native behavior, we need to clear the header first and then use
                // regular title if menuTitle is not provided. If title is also null, there will be
                // no submenu header at all.
                subMenu.clearHeader()
                subMenu.setHeaderTitle(update.valueOrNull() ?: menuItem.title)
            } else {
                Log.w(TAG, "[RNScreens] menuTitle ignored: target is not a submenu.")
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

    private fun StackHeaderToolbarMenuItemConfig.toOptions() =
        StackHeaderToolbarMenuElementOptions(
            title = StackHeaderToolbarUpdate.from(title),
            titleCondensed = StackHeaderToolbarUpdate.from(titleCondensed),
            tooltipText = StackHeaderToolbarUpdate.from(tooltipText),
            hidden = hidden,
            disabled = disabled,
            showAsAction = showAsAction,
            icon = StackHeaderToolbarUpdate.from(icon),
            iconTintColorNormal = StackHeaderToolbarUpdate.from(iconTintColorNormal),
            iconTintColorPressed = StackHeaderToolbarUpdate.from(iconTintColorPressed),
            iconTintColorFocused = StackHeaderToolbarUpdate.from(iconTintColorFocused),
            iconTintColorDisabled = StackHeaderToolbarUpdate.from(iconTintColorDisabled),
        )

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

    private fun getResolvedIconTintList(
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuElementOptions,
    ): ColorStateList? {
        val currentTintList = MenuItemCompat.getIconTintList(menuItem)
        // The currently-applied normal (catch-all) color, if any. Used both as the "leave
        // unchanged" value for normal and to dedup read-back overrides: when a normal entry
        // exists every override probe also matches it, so an override equal to the current
        // normal is the catch-all leaking through rather than an explicit override.
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

    /**
     * Resolves the color the receiver applies to [stateSet], or `null` when no state spec
     * matches it.
     *
     * `getColorForState` returns the caller-supplied fallback when nothing matches, so we
     * probe twice with two distinct sentinels: equal results mean a real spec matched (the
     * actual color), differing results mean the slot is absent. This is robust for any color
     * value and keeps the read-back stateless — see [getResolvedIconTintList].
     */
    private fun ColorStateList.resolvedColorOrNull(stateSet: IntArray): Int? {
        val a = getColorForState(stateSet, SENTINEL_A)
        val b = getColorForState(stateSet, SENTINEL_B)
        return if (a == b) a else null
    }

    // endregion

    companion object {
        private const val TAG = "StackHeaderApplicator"

        // Two distinct sentinel fallbacks used to detect whether a ColorStateList actually
        // defines a color for a given state. Their concrete values are irrelevant as long as
        // they differ — see resolvedColorOrNull.
        private const val SENTINEL_A = 0x00000001
        private const val SENTINEL_B = 0x00000002
    }
}
