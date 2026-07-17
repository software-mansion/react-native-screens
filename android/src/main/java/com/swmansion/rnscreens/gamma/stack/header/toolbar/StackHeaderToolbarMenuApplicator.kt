package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.os.Build
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.core.view.MenuItemCompat
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.gamma.stack.header.getResizedDrawable
import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuElementConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuGroupConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuGroupMetadata
import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.model.StackHeaderToolbarMenuItemType
import com.swmansion.rnscreens.gamma.stack.header.toolbar.update.StackHeaderToolbarFieldUpdate
import com.swmansion.rnscreens.gamma.stack.header.toolbar.update.StackHeaderToolbarMenuElementOptions
import com.swmansion.rnscreens.gamma.stack.header.toolbar.update.valueOrNull

/**
 * Builds the toolbar menu from its config and applies in-place element updates
 * (options, checkability, icon tint).
 */
internal object StackHeaderToolbarMenuApplicator {
    // region Mappings & metadata

    internal fun generateToolbarMenuItemMappings(menuConfig: StackHeaderToolbarMenuConfig): Pair<Map<String, Int>, Map<Int, String>> {
        val forwardIdMap = mutableMapOf<String, Int>()
        val reverseIdMap = mutableMapOf<Int, String>()
        var counter = 1
        assignElementIds(menuConfig.children, forwardIdMap, reverseIdMap) { counter++ }
        return Pair(forwardIdMap.toMap(), reverseIdMap.toMap())
    }

    internal fun generateToolbarMenuGroupMappings(menuConfig: StackHeaderToolbarMenuConfig): Map<String, Int> {
        val forwardGroupIdMap = mutableMapOf<String, Int>()
        var counter = 1
        assignGroupIds(menuConfig, forwardGroupIdMap) { counter++ }
        return forwardGroupIdMap.toMap()
    }

    internal fun computeGroupMetadata(menuConfig: StackHeaderToolbarMenuConfig): StackHeaderToolbarMenuGroupMetadata {
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

    internal fun validateRadioInitialSelection(menuConfig: StackHeaderToolbarMenuConfig) {
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
     * Recursively traverses menu groups and maps user-friendly string group IDs to integers
     * expected by Android.
     *
     * @param menuConfig Menu whose groups — and those of its submenus — will be mapped.
     * @param forwardMap Reference to String->Int group ID map to which entries will be added.
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

    // endregion

    // region Menu build

    internal fun rebuildToolbarMenu(
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

    // endregion

    // region Element updates

    internal fun updateToolbarMenuElement(
        toolbar: MaterialToolbar,
        forwardIdMap: Map<String, Int>,
        id: String,
        options: StackHeaderToolbarMenuElementOptions,
    ) {
        val item =
            forwardIdMap[id]?.let { toolbar.menu.findItem(it) } ?: run {
                Log.e(TAG, "[RNScreens] Unable to find menu element with id '$id'.")
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
        options.accessibilityLabel?.let {
            // Setting `null` will restore Android's default (`title` for items
            // in toolbar, `null` otherwise).
            MenuItemCompat.setContentDescription(menuItem, it.valueOrNull())
        }
        options.hidden?.let { menuItem.isVisible = !it }
        options.disabled?.let { menuItem.isEnabled = !it }
        options.showAsAction?.let { menuItem.setShowAsAction(it.toNativeShowAsAction()) }

        // checked is intentionally not handled here. The coordinator layout manages it in
        // applyGroupItemStateChange because toggling checked state requires group metadata
        // (radio vs checkbox) and may emit onGroupSelectionChanged events.

        options.icon?.let {
            when (it) {
                StackHeaderToolbarFieldUpdate.Reset -> menuItem.icon = null
                is StackHeaderToolbarFieldUpdate.Set<Drawable> ->
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

    private fun StackHeaderToolbarMenuItemConfig.toOptions() =
        StackHeaderToolbarMenuElementOptions(
            title = StackHeaderToolbarFieldUpdate.from(title),
            titleCondensed = StackHeaderToolbarFieldUpdate.from(titleCondensed),
            tooltipText = StackHeaderToolbarFieldUpdate.from(tooltipText),
            accessibilityLabel = StackHeaderToolbarFieldUpdate.from(accessibilityLabel),
            hidden = hidden,
            disabled = disabled,
            showAsAction = showAsAction,
            icon = StackHeaderToolbarFieldUpdate.from(icon),
            iconTintColorNormal = StackHeaderToolbarFieldUpdate.from(iconTintColorNormal),
            iconTintColorPressed = StackHeaderToolbarFieldUpdate.from(iconTintColorPressed),
            iconTintColorFocused = StackHeaderToolbarFieldUpdate.from(iconTintColorFocused),
            iconTintColorDisabled = StackHeaderToolbarFieldUpdate.from(iconTintColorDisabled),
        )

    // endregion

    // region Icon tint

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
                StackHeaderToolbarFieldUpdate.Reset -> null
                is StackHeaderToolbarFieldUpdate.Set -> update.value
                null -> currentNormal
            }

        val finalDisabled =
            when (val update = options.iconTintColorDisabled) {
                StackHeaderToolbarFieldUpdate.Reset -> null
                is StackHeaderToolbarFieldUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(-android.R.attr.state_enabled))
                        ?.takeIf { it != currentNormal }
            }

        val finalPressed =
            when (val update = options.iconTintColorPressed) {
                StackHeaderToolbarFieldUpdate.Reset -> null
                is StackHeaderToolbarFieldUpdate.Set -> update.value
                null ->
                    currentTintList
                        ?.resolvedColorOrNull(intArrayOf(android.R.attr.state_enabled, android.R.attr.state_pressed))
                        ?.takeIf { it != currentNormal }
            }

        val finalFocused =
            when (val update = options.iconTintColorFocused) {
                StackHeaderToolbarFieldUpdate.Reset -> null
                is StackHeaderToolbarFieldUpdate.Set -> update.value
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

    private const val TAG = "StackHeaderToolbarMenuApplicator"

    // Two distinct sentinel fallbacks used to detect whether a ColorStateList actually
    // defines a color for a given state. Their concrete values are irrelevant as long as
    // they differ — see resolvedColorOrNull.
    private const val SENTINEL_A = 0x00000001
    private const val SENTINEL_B = 0x00000002
}
