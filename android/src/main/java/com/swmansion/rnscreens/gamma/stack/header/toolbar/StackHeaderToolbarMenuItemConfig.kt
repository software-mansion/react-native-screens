package com.swmansion.rnscreens.gamma.stack.header.toolbar

data class StackHeaderToolbarMenuItemConfig(
    val id: String,
    val title: String,
    val hidden: Boolean,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction,
)
