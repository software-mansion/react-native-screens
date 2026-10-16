package com.swmansion.rnscreens.core.containers.tabs.screen

/**
 * Parts of a tab's configuration that changed. Reported by the tab to its
 * [TabsItemConfigurationObserver]; the consumer decides what to re-apply.
 */
@JvmInline
internal value class TabsItemInvalidationFlags(
    val raw: Int,
) {
    companion object {
        val NONE = TabsItemInvalidationFlags(0)
        val TITLE = TabsItemInvalidationFlags(1 shl 0)
        val ICON = TabsItemInvalidationFlags(1 shl 1)
        val BADGE = TabsItemInvalidationFlags(1 shl 2)
        val ACCESSIBILITY = TabsItemInvalidationFlags(1 shl 3)
        val APPEARANCE = TabsItemInvalidationFlags(1 shl 4)
        val ICON_SIZE = TabsItemInvalidationFlags(1 shl 5)
        val ACTIVE_INDICATOR_SIZE = TabsItemInvalidationFlags(1 shl 6)
        val ALL =
            TITLE or ICON or BADGE or ACCESSIBILITY or APPEARANCE or ICON_SIZE or ACTIVE_INDICATOR_SIZE
    }

    infix fun or(other: TabsItemInvalidationFlags) = TabsItemInvalidationFlags(raw or other.raw)

    fun containsAny(flags: TabsItemInvalidationFlags) = flags.raw != 0 && (raw and flags.raw) != 0
}
