package com.swmansion.rnscreens.stack.animation.spec

internal data class SlotSpec(
    val tracks: List<TrackSpec>,
    val dim: DimSpec?,
    val durationMs: Long,
) {
    companion object {
        fun noOp(durationMs: Long) = SlotSpec(emptyList(), dim = null, durationMs)
    }
}
