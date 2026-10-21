package com.swmansion.rnscreens.core.containers.stack.animation.spec

internal data class SlotSpec(
    val tracks: List<TrackSpec>,
    val durationMs: Long,
) {
    companion object {
        fun noOp(durationMs: Long) = SlotSpec(emptyList(), durationMs)
    }
}
