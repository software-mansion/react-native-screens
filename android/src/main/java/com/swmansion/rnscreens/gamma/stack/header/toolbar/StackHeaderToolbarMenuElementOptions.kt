package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.graphics.drawable.Drawable

/**
 * Partial update for a toolbar menu element.
 *
 * A `null` field means "leave the current value unchanged".
 */
internal data class StackHeaderToolbarMenuElementOptions(
    val title: StackHeaderToolbarUpdate<String>? = null,
    val titleCondensed: StackHeaderToolbarUpdate<String>? = null,
    val tooltipText: StackHeaderToolbarUpdate<String>? = null,
    val hidden: Boolean? = null,
    val disabled: Boolean? = null,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction? = null,
    val icon: StackHeaderToolbarUpdate<Drawable>?,
    val iconTintColorNormal: StackHeaderToolbarUpdate<Int>?,
    val iconTintColorPressed: StackHeaderToolbarUpdate<Int>?,
    val iconTintColorFocused: StackHeaderToolbarUpdate<Int>?,
    val iconTintColorDisabled: StackHeaderToolbarUpdate<Int>?,
    val checked: Boolean? = null,
    val menuTitle: StackHeaderToolbarUpdate<String>? = null,
) {
    val requiresIconTintColorUpdate: Boolean
        get() =
            iconTintColorNormal != null ||
                iconTintColorPressed != null ||
                iconTintColorFocused != null ||
                iconTintColorDisabled != null
}
