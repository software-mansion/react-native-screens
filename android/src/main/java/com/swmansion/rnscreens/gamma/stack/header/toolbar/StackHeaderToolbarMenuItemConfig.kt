package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

data class StackHeaderToolbarMenuItemConfig(
    val id: String,
    val title: String,
    val hidden: Boolean,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction,
    val icon: Drawable?,
    val iconTintColorNormal: Int?,
    val iconTintColorPressed: Int?,
    val iconTintColorFocused: Int?,
    val iconTintColorDisabled: Int?,
)
