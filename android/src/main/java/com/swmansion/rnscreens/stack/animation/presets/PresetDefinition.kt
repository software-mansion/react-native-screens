package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.RowKind
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec

/**
 * A `null` slot is a static side: the screen stays put behind a seekable no-op spanning the row.
 */
internal data class AuthoredRow(
    val inSlot: SlotSpec?,
    val outSlot: SlotSpec?,
)

/**
 * Both rows of a preset, authored in absolute milliseconds. [referenceDurationMs] is the push
 * row's length, the anchor a `duration` override rescales against.
 */
internal data class PresetDefinition(
    val referenceDurationMs: Long,
    val push: AuthoredRow,
    val pop: AuthoredRow,
) {
    fun row(kind: RowKind): AuthoredRow =
        when (kind) {
            RowKind.PUSH -> push
            RowKind.POP -> pop
        }
}
