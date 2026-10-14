package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length

internal object FadePresets {
    // `rns_fade_in.xml` / `rns_fade_out.xml`: 150 ms ("duration taken from debugging source code").
    private const val FADE_DURATION_MS = 150L

    // `rns_fade_from_bottom.xml` (AOSP Nougat `activity_open_enter.xml`) with `rns_no_animation_350.xml`
    // on the covered side: a 350 ms rise, the fade over its first 210 ms.
    private const val RISE_DURATION_MS = 350L
    private const val RISE_FADE_DURATION_MS = 210L

    // `rns_fade_to_bottom.xml` (AOSP `activity_close_exit.xml`) with `rns_no_animation_250.xml`:
    // a 250 ms fall, the fade over 100-250 ms.
    private const val FALL_DURATION_MS = 250L
    private const val FALL_FADE_START_MS = 100L
    private const val FALL_FADE_DURATION_MS = 150L

    private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val EASING_DECELERATE_QUINT = Easing.Named(EasingName.DECELERATE_QUINT)
    private val EASING_ACCELERATE_QUINT = Easing.Named(EasingName.ACCELERATE_QUINT)
    private val EASING_LINEAR = Easing.Named(EasingName.LINEAR)

    // The XML's 8 % of the height; iOS uses the same `0.08 * height` (`RNSScreenStackAnimator.mm:394`).
    internal val DISTANCE_RISE: Length = Length.Percent(0.08f)

    internal fun fade(): PresetDefinition {
        val enter = listOf(Tracks.opacity(0f, 1f, FADE_DURATION_MS, EASING_ACCELERATE_DECELERATE))
        val exit = listOf(Tracks.opacity(1f, 0f, FADE_DURATION_MS, EASING_ACCELERATE_DECELERATE))
        return PresetDefinition(push = pushTimeline(enter, exit), pop = popTimeline(enter, exit))
    }

    /**
     * The moving screen fades while travelling a short distance from [edge]; the other screen
     * stays put; the pop is shorter than the push (250 vs 350 ms), as in the legacy XMLs.
     */
    internal fun fadeFrom(
        edge: Edge,
        distance: Length = DISTANCE_RISE,
    ) = PresetDefinition(
        push =
            pushTimeline(
                enter =
                    listOf(
                        Tracks.opacity(0f, 1f, RISE_FADE_DURATION_MS, EASING_DECELERATE_QUINT),
                        Tracks.translateFrom(edge, distance, isAppearing = true, RISE_DURATION_MS, EASING_DECELERATE_QUINT),
                    ),
                exit = emptyList(),
            ),
        pop =
            popTimeline(
                enter = emptyList(),
                exit =
                    listOf(
                        Tracks.opacity(1f, 0f, FALL_FADE_DURATION_MS, EASING_LINEAR, startMs = FALL_FADE_START_MS),
                        Tracks.translateFrom(edge.opposite(), distance, isAppearing = false, FALL_DURATION_MS, EASING_ACCELERATE_QUINT),
                    ),
            ),
    )
}
