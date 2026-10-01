package com.swmansion.rnscreens.stack.header.toolbar.update

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuElementConfig
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
    val icon: StackHeaderToolbarFieldUpdate<Drawable>? = null,
    val iconTintColorNormal: StackHeaderToolbarFieldUpdate<Int>? = null,
    val iconTintColorPressed: StackHeaderToolbarFieldUpdate<Int>? = null,
    val iconTintColorFocused: StackHeaderToolbarFieldUpdate<Int>? = null,
    val iconTintColorDisabled: StackHeaderToolbarFieldUpdate<Int>? = null,
    val menuTitle: StackHeaderToolbarFieldUpdate<String>? = null,
) {
    val requiresIconTintColorUpdate: Boolean
        get() =
            iconTintColorNormal != null ||
                iconTintColorPressed != null ||
                iconTintColorFocused != null ||
                iconTintColorDisabled != null

    val isEmpty: Boolean
        get() = this == DEFAULT

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
            menuTitle = newer.menuTitle ?: menuTitle,
        )

    private companion object {
        val DEFAULT = StackHeaderToolbarMenuElementOptions()
    }
}

/**
 * The element's declared configuration as absolute options — every field is
 * Set/Reset, never "leave unchanged". The icon slot is always Reset: parsed
 * configs carry no Drawables; resolved icons overlay this at application time.
 * [StackHeaderToolbarMenuElementOptions.menuTitle] stays "unchanged" for a
 * plain item, which has no submenu header to write.
 */
internal fun StackHeaderToolbarMenuElementConfig.toOptions() =
    StackHeaderToolbarMenuElementOptions(
        title = StackHeaderToolbarFieldUpdate.from(item.title),
        titleCondensed = StackHeaderToolbarFieldUpdate.from(item.titleCondensed),
        tooltipText = StackHeaderToolbarFieldUpdate.from(item.tooltipText),
        accessibilityLabel = StackHeaderToolbarFieldUpdate.from(item.accessibilityLabel),
        hidden = item.hidden,
        disabled = item.disabled,
        showAsAction = item.showAsAction,
        icon = StackHeaderToolbarFieldUpdate.Reset,
        iconTintColorNormal = StackHeaderToolbarFieldUpdate.from(item.iconTintColorNormal),
        iconTintColorPressed = StackHeaderToolbarFieldUpdate.from(item.iconTintColorPressed),
        iconTintColorFocused = StackHeaderToolbarFieldUpdate.from(item.iconTintColorFocused),
        iconTintColorDisabled = StackHeaderToolbarFieldUpdate.from(item.iconTintColorDisabled),
        menuTitle =
            (this as? StackHeaderToolbarMenuElementConfig.Submenu)
                ?.let { StackHeaderToolbarFieldUpdate.from(it.menuTitle) },
    )
