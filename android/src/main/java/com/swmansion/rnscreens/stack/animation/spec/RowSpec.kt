package com.swmansion.rnscreens.stack.animation.spec

internal data class RowSpec(
    val inSlot: SlotSpec,
    val outSlot: SlotSpec,
    val outZPolicy: ZPolicy,
) {
    val durationMs: Long
        get() = maxOf(inSlot.durationMs, outSlot.durationMs)
}
