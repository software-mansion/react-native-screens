package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

data class StackHeaderToolbarMenuConfig(
    val children: List<StackHeaderToolbarMenuElementConfig>,
) {
    fun updateItemIcon(
        id: String,
        icon: Drawable?,
    ): StackHeaderToolbarMenuConfig {
        val updated = updateChildrenIcon(children, id, icon)
        return if (updated !== children) StackHeaderToolbarMenuConfig(updated) else this
    }
}

sealed interface StackHeaderToolbarMenuElementConfig {
    val item: StackHeaderToolbarMenuItemConfig

    data class MenuItem(
        override val item: StackHeaderToolbarMenuItemConfig,
    ) : StackHeaderToolbarMenuElementConfig

    data class Menu(
        override val item: StackHeaderToolbarMenuItemConfig,
        val children: List<StackHeaderToolbarMenuElementConfig>,
    ) : StackHeaderToolbarMenuElementConfig
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
                is StackHeaderToolbarMenuElementConfig.Menu -> element.copy(item = newItem)
            }
        }
        return element
    }

    if (element is StackHeaderToolbarMenuElementConfig.Menu) {
        val updatedChildren = updateChildrenIcon(element.children, id, icon)
        if (updatedChildren !== element.children) {
            return element.copy(children = updatedChildren)
        }
    }

    return element
}
