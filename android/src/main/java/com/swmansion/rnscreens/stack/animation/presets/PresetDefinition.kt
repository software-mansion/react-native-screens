package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value

/**
 * Presets are authored in fractions of one reference duration (the push row's), so a
 * duration override rescales the whole choreography and keeps the authored push/pop ratio.
 */
internal data class TrackTemplate(
    val property: TrackProperty,
    val from: Value,
    val to: Value,
    val start: Float = 0f,
    val duration: Float = 1f,
    val easing: Easing? = null,
)

internal data class SlotTemplate(
    val tracks: List<TrackTemplate>,
)

/**
 * A `null` slot is a static side: the screen stays put behind a seekable no-op spanning the row.
 */
internal data class RowTemplate(
    val inSlot: SlotTemplate?,
    val outSlot: SlotTemplate?,
)

internal data class PresetDefinition(
    val referenceDurationMs: Long,
    val easing: Easing,
    val push: RowTemplate,
    val pop: RowTemplate,
)
