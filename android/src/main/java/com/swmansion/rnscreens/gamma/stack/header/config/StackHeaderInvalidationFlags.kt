package com.swmansion.rnscreens.gamma.stack.header.config

@JvmInline
internal value class StackHeaderInvalidationFlags(
    val raw: Int,
) {
    companion object {
        val NONE = StackHeaderInvalidationFlags(0)
        val STRUCTURE = StackHeaderInvalidationFlags(1 shl 0)
        val SUBVIEWS = StackHeaderInvalidationFlags(1 shl 1)
        val TITLE = StackHeaderInvalidationFlags(1 shl 2)
        val BACK_BUTTON = StackHeaderInvalidationFlags(1 shl 3)
        val SCROLL_FLAGS = StackHeaderInvalidationFlags(1 shl 4)
        val TOOLBAR_MENU = StackHeaderInvalidationFlags(1 shl 5)

        val APPEARANCE = TITLE or BACK_BUTTON
        val ALL = STRUCTURE or SUBVIEWS or APPEARANCE or SCROLL_FLAGS or TOOLBAR_MENU
    }

    infix fun or(other: StackHeaderInvalidationFlags) = StackHeaderInvalidationFlags(raw or other.raw)

    fun containsAny(flags: StackHeaderInvalidationFlags) = flags.raw != 0 && (raw and flags.raw) != 0

    fun clearing(flags: StackHeaderInvalidationFlags) = StackHeaderInvalidationFlags(raw and flags.raw.inv())

    val isNotEmpty get() = raw != 0

    val isEmpty get() = raw == 0

    val needsRebuild get() = containsAny(STRUCTURE or SUBVIEWS)
}
