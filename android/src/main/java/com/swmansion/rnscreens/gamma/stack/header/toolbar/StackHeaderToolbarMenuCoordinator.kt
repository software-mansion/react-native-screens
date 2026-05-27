package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.R
import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.core.view.MenuItemCompat
import com.google.android.material.appbar.MaterialToolbar

internal class StackHeaderToolbarMenuCoordinator(
    private val onItemClicked: (id: String) -> Unit,
) {
    private val forwardIdMap = HashMap<String, Int>()
    private val reverseIdMap = HashMap<Int, String>()
    private var lastMenuItems: List<StackHeaderToolbarMenuItemConfig> = emptyList()

    internal fun rebuildMenuIfNeeded(
        toolbar: MaterialToolbar,
        items: List<StackHeaderToolbarMenuItemConfig>,
    ) {
        if (items == lastMenuItems) return

        toolbar.menu.clear()
        forwardIdMap.clear()
        reverseIdMap.clear()

        items.forEachIndexed { index, item ->
            // We use IDs > 0 because 0 is Menu.NONE.
            val nativeId = index + 1
            forwardIdMap[item.id] = nativeId
            reverseIdMap[nativeId] = item.id
            val menuItem = toolbar.menu.add(Menu.NONE, nativeId, index, null)

            applyOptions(menuItem, item.toOptions())
        }

        toolbar.setOnMenuItemClickListener { menuItem ->
            reverseIdMap[menuItem.itemId]?.let(onItemClicked)
            true
        }

        lastMenuItems = items
    }

    internal fun clear() {
        forwardIdMap.clear()
        reverseIdMap.clear()
        lastMenuItems = emptyList()
    }

    internal fun updateItem(
        menu: Menu,
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        val item =
            forwardIdMap[id]?.let { menu.findItem(it) } ?: run {
                Log.e(TAG, "[RNScreens] Unable to find menu item.")
                return
            }

        applyOptions(item, options)
    }

    private fun applyOptions(
        menuItem: MenuItem,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        options.title?.let { menuItem.title = it }
        options.hidden?.let { menuItem.isVisible = !it }
        options.showAsAction?.let { menuItem.setShowAsAction(it.toNativeShowAsAction()) }

        options.icon?.let {
            when (it) {
                StackHeaderToolbarUpdate.Reset -> menuItem.icon = null
                is StackHeaderToolbarUpdate.Set<Drawable> -> menuItem.icon = it.value
            }
        }

        if (options.requiresIconTintColorUpdate) {
            val currentTintList = MenuItemCompat.getIconTintList(menuItem)
            val currentDefault = currentTintList?.defaultColor

            // 1. Resolve Normal State
            val finalNormal = when (val update = options.iconTintColorNormal) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null -> currentDefault // Unchanged
            }

            // 2. Resolve Disabled State
            val finalDisabled = when (val update = options.iconTintColorDisabled) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null -> currentTintList?.getColorForState(intArrayOf(-android.R.attr.state_enabled), currentDefault ?: 0)
                    ?.takeIf { it != currentDefault } // Unchanged
            }

            // 3. Resolve Pressed State
            val finalPressed = when (val update = options.iconTintColorPressed) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null -> currentTintList?.getColorForState(intArrayOf(android.R.attr.state_pressed), currentDefault ?: 0)
                    ?.takeIf { it != currentDefault } // Unchanged
            }

            // 4. Resolve Focused State
            val finalFocused = when (val update = options.iconTintColorFocused) {
                StackHeaderToolbarUpdate.Reset -> null
                is StackHeaderToolbarUpdate.Set -> update.value
                null -> currentTintList?.getColorForState(intArrayOf(android.R.attr.state_focused), currentDefault ?: 0)
                    ?.takeIf { it != currentDefault } // Unchanged
            }

            // 5. Build the states and colors arrays (Fallback order matters!)
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
                states.add(intArrayOf()) // Empty array acts as the default fallback
                colors.add(it)
            }

            // 6. Apply or clear the tint list
            if (states.isEmpty()) {
                MenuItemCompat.setIconTintList(menuItem, null)
            } else {
                val colorStateList = ColorStateList(states.toTypedArray(), colors.toIntArray())
                MenuItemCompat.setIconTintList(menuItem, colorStateList)
            }
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

    companion object {
        private const val TAG = "StackHeaderToolbarMenuCoordinator"
    }
}
