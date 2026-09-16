package com.swmansion.rnscreens.core.containers.stack.animation.engine

import com.swmansion.rnscreens.core.containers.stack.animation.model.SlotRole

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
