package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.util.Log
import android.view.Menu
import android.view.MenuItem
import com.google.android.material.appbar.MaterialToolbar

internal class StackHeaderToolbarMenuCoordinator(
    private val onItemClicked: (id: String) -> Unit,
) {
    private var currentMenu: Menu? = null
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

            // This property will be exposed to the user in the future.
            menuItem.setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER)
        }

        toolbar.setOnMenuItemClickListener { menuItem ->
            reverseIdMap[menuItem.itemId]?.let(onItemClicked)
            true
        }

        currentMenu = toolbar.menu
        lastMenuItems = items
    }

    fun clear() {
        currentMenu?.clear()
        currentMenu = null
        forwardIdMap.clear()
        reverseIdMap.clear()
        lastMenuItems = emptyList()
    }

    fun updateItem(
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        val menu = currentMenu
        if (menu == null) {
            Log.e(TAG, "[RNScreens] Attempted to update item in non-existing menu.")
            return
        }

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
    }

    private fun StackHeaderToolbarMenuItemConfig.toOptions() =
        StackHeaderToolbarMenuItemOptions(
            title = title,
            hidden = hidden,
        )

    companion object {
        private const val TAG = "StackHeaderToolbarMenuCoordinator"
    }
}
