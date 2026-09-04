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
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuModel
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarFieldUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementOptions
import com.swmansion.rnscreens.stack.header.toolbar.update.valueOrNull

/**
 * Writes onto the android Menu: builds the toolbar menu from its model and
 * applies in-place element updates (options, checkability, icon tint).
 */
internal object StackHeaderToolbarMenuApplicator {
    // region Menu build

    internal fun rebuildToolbarMenu(
        toolbar: MaterialToolbar,
        model: StackHeaderToolbarMenuModel,
        groupDividerEnabled: Boolean,
        optionsForItem: (id: String) -> StackHeaderToolbarMenuElementOptions,
        onItemClicked: (id: String) -> Unit,
    ) {
        toolbar.menu.clear()
        addElements(toolbar, toolbar.menu, model.config, model.forwardIdMap, model.forwardGroupIdMap, optionsForItem)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            toolbar.menu.setGroupDividerEnabled(groupDividerEnabled)
        }
        toolbar.setOnMenuItemClickListener { menuItem ->
            model.reverseIdMap[menuItem.itemId]?.let(onItemClicked)
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
                }
                is StackHeaderToolbarMenuElementConfig.Submenu -> {
                    val subMenu = menu.addSubMenu(groupIntId, itemId, index, null)
                    applyMenuElementOptions(toolbar, subMenu.item, optionsForItem(element.item.id))
                    addElements(toolbar, subMenu, element.menu, forwardIdMap, forwardGroupIdMap, optionsForItem)
                }
            }
        }
        configureGroupCheckability(menu, menuConfig.groups, forwardGroupIdMap)
    }

    // Group membership is the only source of checkability (configs are validated
    // up front, see StackHeaderToolbarMenuModel); checked state belongs to the
    // controller, which projects it right after the rebuild.
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
