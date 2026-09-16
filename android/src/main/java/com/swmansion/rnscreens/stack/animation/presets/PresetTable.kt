package com.swmansion.rnscreens.stack.animation.presets

import com.swmansion.rnscreens.stack.animation.model.Easing
import com.swmansion.rnscreens.stack.animation.model.EasingName
import com.swmansion.rnscreens.stack.animation.model.PresetName
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value
import java.util.EnumMap

internal object PresetTable {
    // Legacy `config_mediumAnimTime`.
    private const val SLIDE_DURATION_MS = 400L
    private const val FADE_DURATION_MS = 150L
    private const val FADE_FROM_DURATION_MS = 350L

    // Legacy `config_shortAnimTime`.
    private const val IOS_DURATION_MS = 200L

    // Non-zero so that a predictive back gesture scrubs the pop instead of completing it at
    // gesture start, which destroys the fragment before FragmentManager commits the pop.
    private const val NONE_DURATION_MS = 20L

    private const val IOS_DIM_ALPHA = 0.1f

    private val ACCELERATE_DECELERATE = Easing.Named(EasingName.ACCELERATE_DECELERATE)
    private val FULL = Value.Percent(1f)
    private val FADE_FROM_TRAVEL = Value.Percent(0.08f)
    private val IOS_PARALLAX = Value.Percent(0.3f)

    private val definitions: Map<PresetName, PresetDefinition> =
        PresetName.values().associateWithTo(EnumMap(PresetName::class.java)) { build(it) }

    internal fun get(name: PresetName): PresetDefinition = definitions.getValue(name)

    private fun build(name: PresetName): PresetDefinition =
        when (name) {
            PresetName.DEFAULT -> DefaultPreset.definition
            PresetName.SLIDE_FROM_RIGHT -> horizontalSlide(Edge.RIGHT)
            PresetName.SLIDE_FROM_LEFT -> horizontalSlide(Edge.LEFT)
            PresetName.SLIDE_FROM_BOTTOM -> verticalSlide(Edge.BOTTOM)
            PresetName.SLIDE_FROM_TOP -> verticalSlide(Edge.TOP)
            PresetName.FADE -> fade()
            PresetName.FADE_FROM_BOTTOM -> fadeFrom(Edge.BOTTOM)
            PresetName.FADE_FROM_TOP -> fadeFrom(Edge.TOP)
            PresetName.IOS_FROM_RIGHT -> iosParallax(Edge.RIGHT)
            PresetName.IOS_FROM_LEFT -> iosParallax(Edge.LEFT)
            PresetName.NONE ->
                PresetDefinition(
                    referenceDurationMs = NONE_DURATION_MS,
                    easing = ACCELERATE_DECELERATE,
                    push = RowTemplate(inSlot = null, outSlot = null),
                    pop = RowTemplate(inSlot = null, outSlot = null),
                )
        }

    // Both screens travel together (a conveyor); the pop row is the same motion from the
    // opposite edge.
    private fun horizontalSlide(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = SLIDE_DURATION_MS,
            easing = ACCELERATE_DECELERATE,
            push = conveyorRow(edge),
            pop = conveyorRow(edge.opposite()),
        )

    private fun conveyorRow(edge: Edge) =
        RowTemplate(
            inSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = true),
            outSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = false),
        )

    // Only the moving screen travels; the covered / revealed screen stays put (legacy parity).
    private fun verticalSlide(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = SLIDE_DURATION_MS,
            easing = ACCELERATE_DECELERATE,
            push =
                RowTemplate(
                    inSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = true),
                    outSlot = null,
                ),
            pop =
                RowTemplate(
                    inSlot = null,
                    outSlot = DirectionalMotion.slideFrom(edge.opposite(), FULL, appearing = false),
                ),
        )

    private fun fade(): PresetDefinition {
        val crossfade =
            RowTemplate(
                inSlot = SlotTemplate(listOf(opacity(from = 0f, to = 1f))),
                outSlot = SlotTemplate(listOf(opacity(from = 1f, to = 0f))),
            )
        return PresetDefinition(
            referenceDurationMs = FADE_DURATION_MS,
            easing = ACCELERATE_DECELERATE,
            push = crossfade,
            pop = crossfade,
        )
    }

    // Legacy port of the Nougat activity transition: the moving screen fades while travelling
    // a short distance, the other screen stays put, and the pop row is shorter (250 vs 350 ms).
    private fun fadeFrom(edge: Edge): PresetDefinition {
        fun fraction(ms: Long) = ms.toFloat() / FADE_FROM_DURATION_MS
        return PresetDefinition(
            referenceDurationMs = FADE_FROM_DURATION_MS,
            easing = Easing.Named(EasingName.DECELERATE_QUINT),
            push =
                RowTemplate(
                    inSlot =
                        SlotTemplate(
                            listOf(
                                opacity(from = 0f, to = 1f, duration = fraction(210)),
                                DirectionalMotion.translateFrom(edge, FADE_FROM_TRAVEL, appearing = true),
                            ),
                        ),
                    outSlot = null,
                ),
            pop =
                RowTemplate(
                    inSlot = null,
                    outSlot =
                        SlotTemplate(
                            listOf(
                                opacity(
                                    from = 1f,
                                    to = 0f,
                                    start = fraction(100),
                                    duration = fraction(150),
                                    easing = Easing.Named(EasingName.LINEAR),
                                ),
                                DirectionalMotion
                                    .translateFrom(edge.opposite(), FADE_FROM_TRAVEL, appearing = false)
                                    .copy(duration = fraction(250), easing = Easing.Named(EasingName.ACCELERATE_QUINT)),
                            ),
                        ),
                ),
        )
    }

    // The iOS push look: a full-width foreground over a background that recedes by 30 % and
    // darkens slightly.
    private fun iosParallax(edge: Edge) =
        PresetDefinition(
            referenceDurationMs = IOS_DURATION_MS,
            easing = ACCELERATE_DECELERATE,
            push =
                RowTemplate(
                    inSlot = DirectionalMotion.slideFrom(edge, FULL, appearing = true),
                    outSlot =
                        DirectionalMotion
                            .slideFrom(edge, IOS_PARALLAX, appearing = false)
                            .copy(dim = DimTemplate(from = 0f, to = IOS_DIM_ALPHA)),
                ),
            pop =
                RowTemplate(
                    inSlot =
                        DirectionalMotion
                            .slideFrom(edge.opposite(), IOS_PARALLAX, appearing = true)
                            .copy(dim = DimTemplate(from = IOS_DIM_ALPHA, to = 0f)),
                    outSlot = DirectionalMotion.slideFrom(edge.opposite(), FULL, appearing = false),
                ),
        )

    private fun opacity(
        from: Float,
        to: Float,
        start: Float = 0f,
        duration: Float = 1f,
        easing: Easing? = null,
    ) = TrackTemplate(TrackProperty.OPACITY, Value.Scalar(from), Value.Scalar(to), start, duration, easing)
}
