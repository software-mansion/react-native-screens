package com.swmansion.rnscreens.core.containers.stack.animation.spec

internal data class RowSpec(
    val inSlot: SlotSpec,
    val outSlot: SlotSpec,
    val outZPolicy: ZPolicy,
)
