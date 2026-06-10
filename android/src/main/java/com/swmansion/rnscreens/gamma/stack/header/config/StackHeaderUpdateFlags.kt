package com.swmansion.rnscreens.gamma.stack.header.config

@JvmInline
value class StackHeaderUpdateFlags(val raw: Int) {
    companion object {
        val NONE = StackHeaderUpdateFlags(0)
        val STRUCTURE = StackHeaderUpdateFlags(1 shl 0)
        val SUBVIEWS = StackHeaderUpdateFlags(1 shl 1)
        val TITLE = StackHeaderUpdateFlags(1 shl 2)
        val BACK_BUTTON = StackHeaderUpdateFlags(1 shl 3)
        val SCROLL_FLAGS = StackHeaderUpdateFlags(1 shl 4)
        val TOOLBAR_MENU = StackHeaderUpdateFlags(1 shl 5)

        val APPEARANCE = TITLE or BACK_BUTTON
        val ALL = STRUCTURE or SUBVIEWS or APPEARANCE or SCROLL_FLAGS or TOOLBAR_MENU
    }

    infix fun or(other: StackHeaderUpdateFlags) = StackHeaderUpdateFlags(raw or other.raw)

    fun containsAny(flags: StackHeaderUpdateFlags) = flags.raw != 0 && (raw and flags.raw) != 0

    val isNotEmpty get() = raw != 0

    val needsRebuild get() = containsAny(STRUCTURE or SUBVIEWS)
}
