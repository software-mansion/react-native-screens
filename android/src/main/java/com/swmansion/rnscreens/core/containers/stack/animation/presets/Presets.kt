package com.swmansion.rnscreens.core.containers.stack.animation.presets

import com.swmansion.rnscreens.core.containers.stack.animation.model.Length
import com.swmansion.rnscreens.core.containers.stack.animation.model.MotionConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.animation.model.TransitionConfig
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.AnimationTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.Track
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.TransitionTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.endMs
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.scaled
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.withEasing

// The tables are built on every request, which is cheap enough. Options rescale what they are
// written on: a whole animation against its reference duration, a transition or a motion against
// its own length.

/**
 * The transition of [kind] that [config] plays: a preset's own, or, for a custom animation, the
 * one written at its `push` or `pop` position.
 */
internal fun transitionTimelineOf(
    config: StackAnimationConfig,
    kind: StackTransitionKind,
): TransitionTimeline =
    when (config) {
        is StackAnimationConfig.Preset -> presetAnimation(config.preset).transition(kind)
        is StackAnimationConfig.Custom ->
            transitionTimelineOf(
                when (kind) {
                    StackTransitionKind.PUSH -> config.push
                    StackTransitionKind.POP -> config.pop
                },
                kind,
            )
    }

private fun transitionTimelineOf(
    config: TransitionConfig,
    kind: StackTransitionKind,
): TransitionTimeline =
    when (config) {
        is TransitionConfig.Preset -> presetTransition(config.preset, kind)
        is TransitionConfig.Custom ->
            TransitionTimeline.of(
                kind,
                enter = motionTracksOf(config.enter, isAppearing = true),
                exit = motionTracksOf(config.exit, isAppearing = false),
            )
    }

private fun motionTracksOf(
    config: MotionConfig,
    isAppearing: Boolean,
): List<Track> =
    when (config) {
        is MotionConfig.Preset -> presetMotionTracks(config.preset, isAppearing)
    }

/**
 * Both transitions of the preset written as the whole animation.
 */
private fun presetAnimation(preset: PresetConfig): AnimationTimeline {
    val (name, options) = preset
    var animation =
        if (name == PresetName.DEFAULT) {
            defaultPreset()
        } else {
            AnimationTimeline(
                push = baseTransition(name, options.distance, StackTransitionKind.PUSH),
                pop = baseTransition(name.opposite, options.distance, StackTransitionKind.POP),
            )
        }
    options.durationMs?.let { animation = animation.retimed(it) }
    options.easing?.let { animation = animation.withEasing(it) }
    return animation
}

/**
 * The transition of the preset written at a push or pop position.
 */
private fun presetTransition(
    preset: PresetConfig,
    kind: StackTransitionKind,
): TransitionTimeline {
    val (name, options) = preset
    var transition = baseTransition(name, options.distance, kind)
    options.durationMs?.let { transition = transition.scaled(it.toFloat() / transition.durationMs) }
    options.easing?.let { transition = transition.withEasing(it) }
    return transition
}

/**
 * The motion of the preset written at an enter or exit position.
 */
private fun presetMotionTracks(
    preset: PresetConfig,
    isAppearing: Boolean,
): List<Track> {
    val (name, options) = preset
    var tracks = baseMotionTracks(name, options.distance, isAppearing)
    options.durationMs?.let { tracks = tracks.scaled(it.toFloat() / tracks.endMs) }
    options.easing?.let { tracks = tracks.withEasing(it) }
    return tracks
}

/**
 * The pushed or popped screen moves along the name's vector; the other screen moves with it only
 * for the names that move both. The position decides which screen is which and the z-order.
 */
private fun baseTransition(
    name: PresetName,
    distance: Length?,
    kind: StackTransitionKind,
): TransitionTimeline =
    when (name) {
        PresetName.IOS_FROM_RIGHT -> iosFromTransition(Edge.RIGHT, kind)
        PresetName.IOS_FROM_LEFT -> iosFromTransition(Edge.LEFT, kind)
        PresetName.DEFAULT -> error("[RNScreens] `default` is only a whole animation, see PresetName.levels.")
        PresetName.NONE,
        PresetName.FADE,
        PresetName.SLIDE_FROM_RIGHT,
        PresetName.SLIDE_FROM_LEFT,
        PresetName.SLIDE_FROM_BOTTOM,
        PresetName.SLIDE_FROM_TOP,
        PresetName.FADE_FROM_BOTTOM,
        PresetName.FADE_FROM_TOP,
        -> {
            val isPush = kind == StackTransitionKind.PUSH
            val movingScreen = baseMotionTracks(name, distance, isAppearing = isPush)
            val otherScreen = if (name.movesBothScreens) baseMotionTracks(name, distance, isAppearing = !isPush) else emptyList()
            TransitionTimeline.of(
                kind,
                enter = if (isPush) movingScreen else otherScreen,
                exit = if (isPush) otherScreen else movingScreen,
            )
        }
    }

private fun baseMotionTracks(
    name: PresetName,
    distance: Length?,
    isAppearing: Boolean,
): List<Track> =
    when (name) {
        PresetName.NONE -> emptyList()
        PresetName.FADE -> fadeTracks(isAppearing)
        PresetName.SLIDE_FROM_RIGHT -> slideTracks(Edge.RIGHT, distance, isAppearing)
        PresetName.SLIDE_FROM_LEFT -> slideTracks(Edge.LEFT, distance, isAppearing)
        PresetName.SLIDE_FROM_BOTTOM -> slideTracks(Edge.BOTTOM, distance, isAppearing)
        PresetName.SLIDE_FROM_TOP -> slideTracks(Edge.TOP, distance, isAppearing)
        PresetName.FADE_FROM_BOTTOM -> fadeFromTracks(Edge.BOTTOM, distance, isAppearing)
        PresetName.FADE_FROM_TOP -> fadeFromTracks(Edge.TOP, distance, isAppearing)
        PresetName.DEFAULT, PresetName.IOS_FROM_RIGHT, PresetName.IOS_FROM_LEFT ->
            error("[RNScreens] `${name.stringName}` has no single-screen motion, see PresetName.levels.")
    }
