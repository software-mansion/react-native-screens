package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

/**
 * Partial update for a toolbar menu item.
 *
 * A `null` field means "leave the current value unchanged".
 */
internal data class StackHeaderToolbarMenuItemOptions(
    val title: String? = null,
    val hidden: Boolean? = null,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction? = null,
    val icon: StackHeaderToolbarUpdate<Drawable>?,
    val iconTintColorNormal: StackHeaderToolbarUpdate<Int>?,
    val iconTintColorPressed: StackHeaderToolbarUpdate<Int>?,
    val iconTintColorFocused: StackHeaderToolbarUpdate<Int>?,
    val iconTintColorDisabled: StackHeaderToolbarUpdate<Int>?,
) {
    val requiresIconTintColorUpdate: Boolean
        get() =
            iconTintColorNormal != null ||
                iconTintColorPressed != null ||
                iconTintColorFocused != null ||
                iconTintColorDisabled != null
}
