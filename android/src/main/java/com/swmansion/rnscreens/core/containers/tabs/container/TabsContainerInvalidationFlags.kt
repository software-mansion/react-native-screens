package com.swmansion.rnscreens.core.containers.tabs.container

/**
 * Parts of [TabsContainer] that are out of date. Recorded as they are invalidated and applied by the
 * container's next update.
 */
@JvmInline
internal value class TabsContainerInvalidationFlags(
    val raw: Int,
) {
    companion object {
        val NONE = TabsContainerInvalidationFlags(0)

        /**
         * A navigation state update request is pending.
         */
        val SELECTED_TAB = TabsContainerInvalidationFlags(1 shl 0)

        /**
         * Tabs were added or removed, so the menu may need to be rebuilt.
         */
        val NAVIGATION_MENU_STRUCTURE = TabsContainerInvalidationFlags(1 shl 1)

        /**
         * Some menu items have changes of their own pending (see [TabsMenuItemState]).
         */
        val MENU_ITEMS = TabsContainerInvalidationFlags(1 shl 2)

        val TAB_BAR_VISIBILITY = TabsContainerInvalidationFlags(1 shl 3)

        /**
         * The icon box shared by all menu items, sized by the icons and active indicators of every tab.
         */
        val ICON_BOX = TabsContainerInvalidationFlags(1 shl 4)

        /**
         * The selected tab, or its appearance, changed. The parts of it that differ from the appearance
         * the tab bar shows are re-applied: [SHARED_APPEARANCE], [BADGE_APPEARANCE] and [TITLE_FONTS].
         */
        val SELECTED_APPEARANCE = TabsContainerInvalidationFlags(1 shl 5)

        /**
         * Tab bar background, item colours, label visibility mode, ripple and active indicator, taken
         * from the selected tab's appearance.
         */
        val SHARED_APPEARANCE = TabsContainerInvalidationFlags(1 shl 6)

        /**
         * Badge colours of every menu item, taken from the selected tab's appearance.
         */
        val BADGE_APPEARANCE = TabsContainerInvalidationFlags(1 shl 7)

        /**
         * Title fonts of every menu item view, taken from the selected tab's appearance.
         */
        val TITLE_FONTS = TabsContainerInvalidationFlags(1 shl 8)

        val ALL =
            SELECTED_TAB or NAVIGATION_MENU_STRUCTURE or MENU_ITEMS or TAB_BAR_VISIBILITY or ICON_BOX or
                SELECTED_APPEARANCE or SHARED_APPEARANCE or BADGE_APPEARANCE or TITLE_FONTS

        /**
         * Parts that fall back to the theme's colours.
         */
        val THEME = SHARED_APPEARANCE or BADGE_APPEARANCE

        /**
         * Parts applied to the whole tab bar at once.
         */
        val BAR_WIDE = TAB_BAR_VISIBILITY or ICON_BOX or SHARED_APPEARANCE or BADGE_APPEARANCE or TITLE_FONTS

        /**
         * Everything the tab bar update applies, after the selected tab is updated.
         */
        val TAB_BAR = BAR_WIDE or SELECTED_APPEARANCE or MENU_ITEMS
    }

    infix fun or(other: TabsContainerInvalidationFlags) = TabsContainerInvalidationFlags(raw or other.raw)

    infix fun and(other: TabsContainerInvalidationFlags) = TabsContainerInvalidationFlags(raw and other.raw)

    infix fun without(other: TabsContainerInvalidationFlags) = TabsContainerInvalidationFlags(raw and other.raw.inv())

    fun containsAny(flags: TabsContainerInvalidationFlags) = flags.raw != 0 && (raw and flags.raw) != 0

    val isEmpty get() = raw == 0
}
