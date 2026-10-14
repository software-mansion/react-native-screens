package com.swmansion.rnscreens.stack.animation.spec

internal data class SlotSpec(
    val tracks: List<TrackSpec>,
    val dim: DimSpec?,
    val durationMs: Long,
) {
    companion object {
        fun of(
            vararg tracks: TrackSpec,
            dim: DimSpec? = null,
        ): SlotSpec {
            val spans: List<TimedSpan> = tracks.toList() + listOfNotNull(dim)
            return SlotSpec(tracks.toList(), dim, durationMs = spans.maxOfOrNull { it.endMs } ?: 0L)
        }

        fun noOp(durationMs: Long) = SlotSpec(emptyList(), dim = null, durationMs)
    }
}
