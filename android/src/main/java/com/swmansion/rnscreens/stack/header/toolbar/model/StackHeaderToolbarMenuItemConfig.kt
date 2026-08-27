package com.swmansion.rnscreens.stack.header.toolbar.model

internal data class StackHeaderToolbarMenuItemConfig(
    val id: String,
    val title: String?,
    val titleCondensed: String?,
    val tooltipText: String?,
    val accessibilityLabel: String?,
    val hidden: Boolean,
    val disabled: Boolean,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction,
    val iconTintColorNormal: Int?,
    val iconTintColorPressed: Int?,
    val iconTintColorFocused: Int?,
    val iconTintColorDisabled: Int?,
    val groupId: String?,
    val itemType: StackHeaderToolbarMenuItemType,
    val initialToggleState: Boolean,
)
