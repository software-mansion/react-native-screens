package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Easing
import com.swmansion.rnscreens.core.containers.stack.animation.model.EasingName
import com.swmansion.rnscreens.core.containers.stack.animation.model.Length

internal object IosPresets {
    // `rns_ios_from_right_*_open/close.xml`: `@android:integer/config_shortAnimTime` (200 ms),
    // `accelerate_decelerate` on the foreground, no interpolator (= the same curve) on the background.
    private const val DURATION_MS = 200L
    private val EASING_ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)

    // The foreground travels the full width; the background recedes by 30 %, as the XMLs' `-30%`
    // and iOS' `containerWidth * 0.3` (`RNSScreenStackAnimator.mm:130, 230`).
    private val DISTANCE_FULL = Length.Percent(1f)
    private val DISTANCE_PARALLAX = Length.Percent(0.3f)

    // iOS `RNSShadowViewMaxAlpha = 0.1` (`RNSScreenStackAnimator.mm:27`); v4 Android had no dim.
    private const val DIM_ALPHA = 0.1f

    /**
     * The iOS push look: a full-width foreground over a background that recedes and darkens slightly.
     */
    internal fun iosFrom(edge: Edge) =
        PresetDefinition(
            push =
                pushTimeline(
                    enter = listOf(travel(edge, DISTANCE_FULL, isAppearing = true)),
                    exit =
                        listOf(
                            travel(edge, DISTANCE_PARALLAX, isAppearing = false),
                            Tracks.dim(0f, DIM_ALPHA, DURATION_MS, EASING_ACCELERATE_DECELERATE),
                        ),
                ),
            pop =
                popTimeline(
                    enter =
                        listOf(
                            travel(edge.opposite(), DISTANCE_PARALLAX, isAppearing = true),
                            Tracks.dim(DIM_ALPHA, 0f, DURATION_MS, EASING_ACCELERATE_DECELERATE),
                        ),
                    exit = listOf(travel(edge.opposite(), DISTANCE_FULL, isAppearing = false)),
                ),
        )

    private fun travel(
        edge: Edge,
        distance: Length,
        isAppearing: Boolean,
    ) = Tracks.translateFrom(edge, distance, isAppearing, DURATION_MS, EASING_ACCELERATE_DECELERATE)
}
