package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

// Immutable tree of data classes. Updates walk the tree recursively and use
// reference comparison (!==) to detect actual changes — only the path from
// the changed leaf to the root is copied; unchanged subtrees keep their
// original instances.
internal data class StackHeaderToolbarMenuConfig(
    val groups: List<StackHeaderToolbarMenuGroupConfig>,
    val children: List<StackHeaderToolbarMenuElementConfig>,
) {
    internal fun updateItemIcon(
        id: String,
        icon: Drawable?,
    ): StackHeaderToolbarMenuConfig {
        val updated = updateChildrenIcon(children, id, icon)
        return if (updated !== children) copy(children = updated) else this
    }

    private fun updateChildrenIcon(
        children: List<StackHeaderToolbarMenuElementConfig>,
        id: String,
        icon: Drawable?,
    ): List<StackHeaderToolbarMenuElementConfig> {
        for ((index, element) in children.withIndex()) {
            val updated = updateElementIcon(element, id, icon)
            if (updated !== element) {
                return children.toMutableList().apply { set(index, updated) }
            }
        }
        return children
    }

    private fun updateElementIcon(
        element: StackHeaderToolbarMenuElementConfig,
        id: String,
        icon: Drawable?,
    ): StackHeaderToolbarMenuElementConfig {
        if (element.item.id == id) {
            if (icon !== element.item.icon) {
                val newItem = element.item.copy(icon = icon)
                return when (element) {
                    is StackHeaderToolbarMenuElementConfig.MenuItem -> element.copy(item = newItem)
                    is StackHeaderToolbarMenuElementConfig.Submenu -> element.copy(item = newItem)
                }
            }
            return element
        }

        if (element is StackHeaderToolbarMenuElementConfig.Submenu) {
            val updatedChildren = updateChildrenIcon(element.menu.children, id, icon)
            if (updatedChildren !== element.menu.children) {
                return element.copy(menu = element.menu.copy(children = updatedChildren))
            }
        }

        return element
    }
}
