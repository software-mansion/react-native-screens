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
        val SELECTED_TAB = TabsContainerInvalidationFlags(1 shl 0)
        val NAVIGATION_MENU_STRUCTURE = TabsContainerInvalidationFlags(1 shl 1)
        val NAVIGATION_MENU_APPEARANCE = TabsContainerInvalidationFlags(1 shl 2)
        val MENU_ITEMS = TabsContainerInvalidationFlags(1 shl 3)
        val ALL = SELECTED_TAB or NAVIGATION_MENU_STRUCTURE or NAVIGATION_MENU_APPEARANCE or MENU_ITEMS
    }

    infix fun or(other: TabsContainerInvalidationFlags) = TabsContainerInvalidationFlags(raw or other.raw)

    infix fun and(other: TabsContainerInvalidationFlags) = TabsContainerInvalidationFlags(raw and other.raw)

    infix fun without(other: TabsContainerInvalidationFlags) = TabsContainerInvalidationFlags(raw and other.raw.inv())

    fun containsAny(flags: TabsContainerInvalidationFlags) = flags.raw != 0 && (raw and flags.raw) != 0

    val isEmpty get() = raw == 0
}
