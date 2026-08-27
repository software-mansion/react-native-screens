package com.swmansion.rnscreens.stack.header.toolbar

import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.os.Build
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.core.view.MenuItemCompat
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.stack.header.getResizedDrawable
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuElementConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuGroupConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuGroupMetadata
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemType
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarFieldUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementOptions
import com.swmansion.rnscreens.stack.header.toolbar.update.valueOrNull

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

    /**
     * Validates constraints not already enforced by the map/metadata
     * generators. Together with them this covers the whole menu shape, so the
     * build path can assume a valid config.
     */
    internal fun validate(menuConfig: StackHeaderToolbarMenuConfig) {
        validateRadioInitialSelection(menuConfig)
        validateItemTypes(menuConfig)
    }

    private fun validateRadioInitialSelection(menuConfig: StackHeaderToolbarMenuConfig) {
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

    private fun validateItemTypes(menuConfig: StackHeaderToolbarMenuConfig) {
        for (element in menuConfig.children) {
            val item = element.item
            when (item.itemType) {
                StackHeaderToolbarMenuItemType.TOGGLE ->
                    require(item.groupId != null) {
                        "[RNScreens] Menu item '${item.id}' has itemType=TOGGLE but no groupId. " +
                            "Toggle items must belong to a group."
                    }
                StackHeaderToolbarMenuItemType.ACTION ->
                    require(item.groupId == null) {
                        "[RNScreens] Menu item '${item.id}' has itemType=ACTION " +
                            "and belongs to a group. Action items cannot belong to groups."
                    }
                StackHeaderToolbarMenuItemType.AUTOMATIC -> Unit
            }
            if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
                validateItemTypes(element.menu)
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
        optionsForItem: (id: String) -> StackHeaderToolbarMenuElementOptions,
        onItemClicked: (id: String) -> Unit,
    ) {
        toolbar.menu.clear()
        addElements(toolbar, toolbar.menu, menuConfig, forwardIdMap, forwardGroupIdMap, optionsForItem)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            toolbar.menu.setGroupDividerEnabled(groupDividerEnabled)
        }
        toolbar.setOnMenuItemClickListener { menuItem ->
            reverseIdMap[menuItem.itemId]?.let(onItemClicked)
            true
        }
    }

    private fun addElements(
        toolbar: MaterialToolbar,
        menu: Menu,
        menuConfig: StackHeaderToolbarMenuConfig,
        forwardIdMap: Map<String, Int>,
        forwardGroupIdMap: Map<String, Int>,
        optionsForItem: (id: String) -> StackHeaderToolbarMenuElementOptions,
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
                    applyMenuElementOptions(toolbar, menuItem, optionsForItem(element.item.id))
                    applyCheckability(menuItem, element.item)
                }
                is StackHeaderToolbarMenuElementConfig.Submenu -> {
                    val subMenu = menu.addSubMenu(groupIntId, itemId, index, null)
                    // Config header first, so an imperative menuTitle in the
                    // element's options can override it.
                    element.menuTitle?.let { subMenu.setHeaderTitle(it) }
                    applyMenuElementOptions(toolbar, subMenu.item, optionsForItem(element.item.id))
                    addElements(toolbar, subMenu, element.menu, forwardIdMap, forwardGroupIdMap, optionsForItem)
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
        // Configs are validated up front (see validate), so checkability
        // reduces to group membership.
        if (itemConfig.groupId != null) {
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

        // checked is intentionally not handled here. StackHeaderToolbarMenuController
        // manages it, because toggling requires group semantics (radio vs checkbox)
        // and may emit onGroupSelectionChanged events.

        options.icon?.let {
            when (it) {
                StackHeaderToolbarFieldUpdate.Reset -> menuItem.icon = null
                is StackHeaderToolbarFieldUpdate.Set<Drawable> ->
                    menuItem.icon = getResizedDrawable(toolbar, it.value)
            }
        }

        // The tint list is built absolutely from the given fields, so whenever
        // this branch runs the caller must pass all four tint slots resolved
        // (Set/Reset) — see StackHeaderToolbarMenuController.effectiveOptions.
        if (options.requiresIconTintColorUpdate || options.icon != null) {
            MenuItemCompat.setIconTintList(menuItem, buildIconTintList(options))
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

        // Apply showAsAction property after icon is set to ensure correct overflow behavior.
        options.showAsAction?.let { menuItem.setShowAsAction(it.toNativeShowAsAction()) }
    }

    // endregion

    // region Icon tint

    private fun buildIconTintList(options: StackHeaderToolbarMenuElementOptions): ColorStateList? {
        val states = mutableListOf<IntArray>()
        val colors = mutableListOf<Int>()

        options.iconTintColorDisabled?.valueOrNull()?.let {
            states.add(intArrayOf(-android.R.attr.state_enabled))
            colors.add(it)
        }

        options.iconTintColorPressed?.valueOrNull()?.let {
            states.add(intArrayOf(android.R.attr.state_pressed))
            colors.add(it)
        }

        options.iconTintColorFocused?.valueOrNull()?.let {
            states.add(intArrayOf(android.R.attr.state_focused))
            colors.add(it)
        }

        options.iconTintColorNormal?.valueOrNull()?.let {
            states.add(intArrayOf())
            colors.add(it)
        }

        return if (states.isNotEmpty()) {
            ColorStateList(states.toTypedArray(), colors.toIntArray())
        } else {
            null
        }
    }

    // endregion

    private const val TAG = "StackHeaderToolbarMenuApplicator"
}
