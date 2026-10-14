package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length

internal object SlidePresets {
    // `rns_slide_in_from_right.xml` and family: `@android:integer/config_mediumAnimTime` (400 ms),
    // no interpolator. Equal to the M3 token `md.sys.motion.duration.medium4`; kept for v4 parity,
    // not derived from it.
    private const val DURATION_MS = 400L
    private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)

    // The legacy XMLs move the full width / height of the container.
    private val DISTANCE_FULL = Length.Percent(1f)

    internal fun slideFrom(edge: Edge): PresetDefinition =
        when (edge) {
            Edge.LEFT, Edge.RIGHT, Edge.START, Edge.END -> conveyor(edge)
            Edge.TOP, Edge.BOTTOM -> oneSided(edge)
        }

    // Both screens travel together; the pop is the same motion from the opposite edge.
    private fun conveyor(edge: Edge) =
        PresetDefinition(
            push = pushTimeline(enter = slide(edge, isAppearing = true), exit = slide(edge, isAppearing = false)),
            pop = popTimeline(enter = slide(edge.opposite(), isAppearing = true), exit = slide(edge.opposite(), isAppearing = false)),
        )

    // Only the moving screen travels; the covered / revealed screen stays put (legacy parity).
    private fun oneSided(edge: Edge) =
        PresetDefinition(
            push = pushTimeline(enter = slide(edge, isAppearing = true), exit = emptyList()),
            pop = popTimeline(enter = emptyList(), exit = slide(edge.opposite(), isAppearing = false)),
        )

    private fun slide(
        edge: Edge,
        isAppearing: Boolean,
    ) = listOf(Tracks.translateFrom(edge, DISTANCE_FULL, isAppearing, DURATION_MS, EASING_ACCELERATE_DECELERATE))
}
