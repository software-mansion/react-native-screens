package com.swmansion.rnscreens.stack.animation.spec

internal data class RowSpec(
    val inSlot: SlotSpec,
    val outSlot: SlotSpec,
    val outZPolicy: ZPolicy,
) {
    companion object {
        /**
         * An omitted side is a static screen behind a seekable no-op spanning the row; a row with
         * no tracks at all (`none`) lasts one [fallbackDurationMs].
         */
        fun of(
            inSlot: SlotSpec?,
            outSlot: SlotSpec?,
            fallbackDurationMs: Long,
            outZPolicy: ZPolicy,
        ): RowSpec {
            val rowDurationMs =
                maxOf(inSlot?.durationMs ?: 0L, outSlot?.durationMs ?: 0L)
                    .takeIf { it > 0L } ?: fallbackDurationMs
            return RowSpec(
                inSlot = inSlot ?: SlotSpec.noOp(rowDurationMs),
                outSlot = outSlot ?: SlotSpec.noOp(rowDurationMs),
                outZPolicy = outZPolicy,
            )
        }
    }
}
