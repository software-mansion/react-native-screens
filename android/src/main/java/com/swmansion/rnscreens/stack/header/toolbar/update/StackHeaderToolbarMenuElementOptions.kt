package com.swmansion.rnscreens.stack.header.toolbar.update

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemShowAsAction

/**
 * Partial update for a toolbar menu element.
 *
 * A `null` field means "leave the current value unchanged".
 */
internal data class StackHeaderToolbarMenuElementOptions(
    val title: StackHeaderToolbarFieldUpdate<String>? = null,
    val titleCondensed: StackHeaderToolbarFieldUpdate<String>? = null,
    val tooltipText: StackHeaderToolbarFieldUpdate<String>? = null,
    val accessibilityLabel: StackHeaderToolbarFieldUpdate<String>? = null,
    val hidden: Boolean? = null,
    val disabled: Boolean? = null,
    val showAsAction: StackHeaderToolbarMenuItemShowAsAction? = null,
    val icon: StackHeaderToolbarFieldUpdate<Drawable>?,
    val iconTintColorNormal: StackHeaderToolbarFieldUpdate<Int>?,
    val iconTintColorPressed: StackHeaderToolbarFieldUpdate<Int>?,
    val iconTintColorFocused: StackHeaderToolbarFieldUpdate<Int>?,
    val iconTintColorDisabled: StackHeaderToolbarFieldUpdate<Int>?,
    val checked: Boolean? = null,
    val menuTitle: StackHeaderToolbarFieldUpdate<String>? = null,
) {
    val requiresIconTintColorUpdate: Boolean
        get() =
            iconTintColorNormal != null ||
                iconTintColorPressed != null ||
                iconTintColorFocused != null ||
                iconTintColorDisabled != null
}
