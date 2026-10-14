package com.swmansion.rnscreens.stack.animation.engine

import com.swmansion.rnscreens.stack.animation.model.SlotRole

/**
 * The four fragment transition slots.
 */
internal enum class TransitionSlot(
    val role: SlotRole,
) {
    ENTER(SlotRole.IN),
    EXIT(SlotRole.OUT),
    RETURN(SlotRole.OUT),
    REENTER(SlotRole.IN),
}
