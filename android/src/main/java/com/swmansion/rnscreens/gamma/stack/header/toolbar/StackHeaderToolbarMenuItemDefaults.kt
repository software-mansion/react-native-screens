package com.swmansion.rnscreens.gamma.stack.header.toolbar

/**
 * Defaults for toolbar menu item fields.
 *
 * Must stay in sync with the codegen spec.
 * Codegen does not fill nested-object defaults,
 * so the native side is the source of truth for them.
 */
internal object StackHeaderToolbarMenuItemDefaults {
    val TITLE: String? = null
    val TITLE_CONDENSED: String? = null
    val TOOLTIP_TEXT: String? = null
    const val HIDDEN: Boolean = false
    const val DISABLED: Boolean = false
    val SHOW_AS_ACTION: StackHeaderToolbarMenuItemShowAsAction = StackHeaderToolbarMenuItemShowAsAction.NEVER
    val ICON_TINT_COLOR_NORMAL: Int? = null
    val ICON_TINT_COLOR_PRESSED: Int? = null
    val ICON_TINT_COLOR_FOCUSED: Int? = null
    val ICON_TINT_COLOR_DISABLED: Int? = null
    val DRAWABLE_ICON_RESOURCE_NAME: String? = null
    val IMAGE_ICON_URI: String? = null
    val ITEM_TYPE: StackHeaderToolbarMenuItemType = StackHeaderToolbarMenuItemType.AUTOMATIC
    const val INITIAL_TOGGLE_STATE: Boolean = false
    const val SINGLE_SELECTION: Boolean = false
}
