package com.swmansion.rnscreens.stack.header.toolbar.update

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuItemConfig
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

    val isEmpty: Boolean
        get() = this == EMPTY

    /** Field-wise merge where [newer]'s non-null fields win. */
    internal fun mergedWith(newer: StackHeaderToolbarMenuElementOptions) =
        StackHeaderToolbarMenuElementOptions(
            title = newer.title ?: title,
            titleCondensed = newer.titleCondensed ?: titleCondensed,
            tooltipText = newer.tooltipText ?: tooltipText,
            accessibilityLabel = newer.accessibilityLabel ?: accessibilityLabel,
            hidden = newer.hidden ?: hidden,
            disabled = newer.disabled ?: disabled,
            showAsAction = newer.showAsAction ?: showAsAction,
            icon = newer.icon ?: icon,
            iconTintColorNormal = newer.iconTintColorNormal ?: iconTintColorNormal,
            iconTintColorPressed = newer.iconTintColorPressed ?: iconTintColorPressed,
            iconTintColorFocused = newer.iconTintColorFocused ?: iconTintColorFocused,
            iconTintColorDisabled = newer.iconTintColorDisabled ?: iconTintColorDisabled,
            checked = newer.checked ?: checked,
            menuTitle = newer.menuTitle ?: menuTitle,
        )

    companion object {
        val EMPTY =
            StackHeaderToolbarMenuElementOptions(
                icon = null,
                iconTintColorNormal = null,
                iconTintColorPressed = null,
                iconTintColorFocused = null,
                iconTintColorDisabled = null,
            )
    }
}

/**
 * The item's declared configuration as absolute options — every field is
 * Set/Reset, never "leave unchanged". The icon slot is always Reset: parsed
 * configs carry no Drawables; resolved icons overlay this at application time.
 */
internal fun StackHeaderToolbarMenuItemConfig.toOptions() =
    StackHeaderToolbarMenuElementOptions(
        title = StackHeaderToolbarFieldUpdate.from(title),
        titleCondensed = StackHeaderToolbarFieldUpdate.from(titleCondensed),
        tooltipText = StackHeaderToolbarFieldUpdate.from(tooltipText),
        accessibilityLabel = StackHeaderToolbarFieldUpdate.from(accessibilityLabel),
        hidden = hidden,
        disabled = disabled,
        showAsAction = showAsAction,
        icon = StackHeaderToolbarFieldUpdate.Reset,
        iconTintColorNormal = StackHeaderToolbarFieldUpdate.from(iconTintColorNormal),
        iconTintColorPressed = StackHeaderToolbarFieldUpdate.from(iconTintColorPressed),
        iconTintColorFocused = StackHeaderToolbarFieldUpdate.from(iconTintColorFocused),
        iconTintColorDisabled = StackHeaderToolbarFieldUpdate.from(iconTintColorDisabled),
    )
