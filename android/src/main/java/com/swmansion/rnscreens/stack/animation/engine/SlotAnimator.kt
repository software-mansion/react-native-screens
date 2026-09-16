package com.swmansion.rnscreens.stack.animation.engine

import android.animation.Animator
import android.animation.ValueAnimator
import android.view.View
import android.view.ViewGroup
import android.view.animation.LinearInterpolator
import androidx.transition.Transition
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec

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
        val metrics = LayoutMetrics.of(view, container)
        val tracks = spec.tracks.map { BoundTrack(it, metrics, view.context) }
        val scrim =
            spec.dim?.let {
                DimScrim(checkNotNull(view as? ViewGroup) { "[RNScreens] A dimmed screen root must be a ViewGroup" }, it)
            }

        return ValueAnimator.ofFloat(0f, 1f).apply {
            duration = spec.durationMs
            interpolator = LinearInterpolator()
            addUpdateListener { animator ->
                val timeMs = animator.animatedFraction * spec.durationMs
                tracks.forEach { it.applyTo(view, timeMs) }
                scrim?.apply(timeMs)
            }
            addListener(RestoreRestValuesListener(view))
            scrim?.attachTo(this, rootTransition)
        }
    }
}
