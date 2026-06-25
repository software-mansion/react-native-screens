package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

internal data class StackHeaderToolbarMenuConfig(
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
        var changed = false
        val result =
            children.map { element ->
                val updated = updateElementIcon(element, id, icon)
                if (updated !== element) changed = true
                updated
            }
        return if (changed) result else children
    }

    private fun updateElementIcon(
        element: StackHeaderToolbarMenuElementConfig,
        id: String,
        icon: Drawable?,
    ): StackHeaderToolbarMenuElementConfig {
        if (element.item.id == id) {
            val newItem = element.item.copy(icon = icon)
            if (newItem.icon !== element.item.icon) {
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
