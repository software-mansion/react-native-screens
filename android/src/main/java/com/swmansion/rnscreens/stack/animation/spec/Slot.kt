package com.swmansion.rnscreens.stack.animation.spec

/**
 * The four fragment transition slots.
 */
internal enum class Slot(
    val appearing: Boolean,
) {
    ENTER(appearing = true),
    EXIT(appearing = false),
    RETURN(appearing = false),
    REENTER(appearing = true),
}
