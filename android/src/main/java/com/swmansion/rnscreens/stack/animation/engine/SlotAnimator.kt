package com.swmansion.rnscreens.stack.animation.engine

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ValueAnimator
import android.view.View
import android.view.ViewGroup
import android.view.animation.Interpolator
import android.view.animation.LinearInterpolator
import androidx.transition.Transition
import com.swmansion.rnscreens.stack.animation.model.TrackProperty
import com.swmansion.rnscreens.stack.animation.model.Value
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec
import com.swmansion.rnscreens.stack.animation.spec.TrackSpec

internal object SlotAnimator {
    /**
     * One linear master animator per slot; every track is a pure function of the master time,
     * which is what keeps the slot scrubbable in both directions by the seek controller.
     * A slot without tracks still returns a full-length animator, so a static screen stays
     * hosted (and drawn) for the whole transition.
     */
    fun create(
        view: View,
        spec: SlotSpec,
        container: ViewGroup,
        rootTransition: Transition,
    ): Animator {
        val density = view.resources.displayMetrics.density
        val mirrored = container.layoutDirection == View.LAYOUT_DIRECTION_RTL
        val tracks = spec.tracks.map { ResolvedTrack(it, container.width, container.height, density, mirrored) }
        val scrim =
            spec.dim?.let {
                DimScrim(checkNotNull(view as? ViewGroup) { "[RNScreens] A dimmed screen root must be a ViewGroup" }, it)
            }

        return ValueAnimator.ofFloat(0f, 1f).apply {
            duration = spec.durationMs
            interpolator = LinearInterpolator()
            addUpdateListener { animator ->
                val timeMs = animator.animatedFraction * spec.durationMs
                tracks.forEach { it.apply(view, timeMs) }
                scrim?.apply(timeMs)
            }
            addListener(RestoreRestValuesListener(view))
            scrim?.attachTo(this, rootTransition)
        }
    }
}

/**
 * Progress of a track spanning [startMs, startMs + durationMs] at [timeMs], clamped to 0..1.
 */
internal fun localFraction(
    timeMs: Float,
    startMs: Long,
    durationMs: Long,
): Float =
    if (durationMs == 0L) {
        if (timeMs < startMs) 0f else 1f
    } else {
        ((timeMs - startMs) / durationMs).coerceIn(0f, 1f)
    }

private class ResolvedTrack(
    spec: TrackSpec,
    containerWidth: Int,
    containerHeight: Int,
    density: Float,
    mirrored: Boolean,
) {
    private val property: TrackProperty = spec.property
    private val sign: Float = if (spec.mirrorInRtl && mirrored) -1f else 1f
    private val from: Float = sign * spec.from.resolve(property, containerWidth, containerHeight, density)
    private val to: Float = sign * spec.to.resolve(property, containerWidth, containerHeight, density)
    private val startMs: Long = spec.startMs
    private val durationMs: Long = spec.durationMs
    private val interpolator: Interpolator = spec.interpolator

    fun apply(
        view: View,
        timeMs: Float,
    ) {
        val value = from + (to - from) * interpolator.getInterpolation(localFraction(timeMs, startMs, durationMs))
        when (property) {
            TrackProperty.TRANSLATE_X -> view.translationX = value
            TrackProperty.TRANSLATE_Y -> view.translationY = value
            TrackProperty.OPACITY -> view.alpha = value
            TrackProperty.SCALE -> {
                view.scaleX = value
                view.scaleY = value
            }
        }
    }
}

private fun Value.resolve(
    property: TrackProperty,
    containerWidth: Int,
    containerHeight: Int,
    density: Float,
): Float =
    when (this) {
        is Value.Scalar -> value
        is Value.Dp -> value * density
        is Value.Percent ->
            fraction *
                when (property) {
                    TrackProperty.TRANSLATE_X -> containerWidth
                    TrackProperty.TRANSLATE_Y -> containerHeight
                    TrackProperty.OPACITY, TrackProperty.SCALE ->
                        error("[RNScreens] Percent values are only valid on translate tracks")
                }
    }

// Fragment views are retained across detach, so a cancelled or reversed transition must not
// leave them displaced.
private class RestoreRestValuesListener(
    private val view: View,
) : AnimatorListenerAdapter() {
    override fun onAnimationEnd(animation: Animator) = restore()

    override fun onAnimationCancel(animation: Animator) = restore()

    private fun restore() {
        view.translationX = 0f
        view.translationY = 0f
        view.alpha = 1f
        view.scaleX = 1f
        view.scaleY = 1f
    }
}
