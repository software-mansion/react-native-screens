package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

internal data class StackHeaderToolbarMenuItemConfig(
    val id: String,
    val title: String?,
    val titleCondensed: String?,
    val tooltipText: String?,
    val hidden: Boolean,
    val disabled: Boolean,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction,
    val icon: Drawable?,
    val iconTintColorNormal: Int?,
    val iconTintColorPressed: Int?,
    val iconTintColorFocused: Int?,
    val iconTintColorDisabled: Int?,
    val groupId: String?,
    val itemType: StackHeaderToolbarMenuItemType,
    val initialToggleState: Boolean,
)
