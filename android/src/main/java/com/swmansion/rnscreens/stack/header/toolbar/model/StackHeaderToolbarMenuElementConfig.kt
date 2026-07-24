package com.swmansion.rnscreens.stack.header.toolbar.model

internal sealed interface StackHeaderToolbarMenuElementConfig {
    val item: StackHeaderToolbarMenuItemConfig

    data class MenuItem(
        override val item: StackHeaderToolbarMenuItemConfig,
    ) : StackHeaderToolbarMenuElementConfig

    data class Submenu(
        override val item: StackHeaderToolbarMenuItemConfig,
        val menu: StackHeaderToolbarMenuConfig,
        val menuTitle: String?,
    ) : StackHeaderToolbarMenuElementConfig
}
