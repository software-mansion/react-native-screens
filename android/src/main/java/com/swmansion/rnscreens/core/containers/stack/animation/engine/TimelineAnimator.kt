package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ValueAnimator
import android.view.View
import android.view.animation.LinearInterpolator
import androidx.transition.Transition
import com.swmansion.rnscreens.core.containers.stack.animation.engine.binding.TrackBinding
import com.swmansion.rnscreens.core.containers.stack.animation.engine.binding.bindTrack
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.MotionTimeline

/**
 * One linear master animator per screen; every track is a pure function of the master time,
 * which is what keeps the screen scrubbable in both directions by the seek controller. A
 * timeline without tracks still returns a full-length animator, so a static screen stays
 * hosted (and drawn) for the whole transition.
 */
internal fun createTimelineAnimator(
    view: View,
    timeline: MotionTimeline,
    metrics: LayoutMetrics,
    rootTransition: Transition,
): Animator {
    val bindings = Array(timeline.tracks.size) { bindTrack(timeline.tracks[it], view, metrics) }
    val listener = TimelineAnimatorListener(bindings)

    return ValueAnimator.ofFloat(0f, 1f).apply {
        duration = timeline.durationMs
        interpolator = LinearInterpolator()
        addUpdateListener { animator ->
            val timeMs = animator.animatedFraction * timeline.durationMs
            // A seek-driven animator (predictive back) is never started: its tracks follow
            // the gesture linearly and the preset's curves apply only to plays.
            val eased = animator.isStarted
            for (i in bindings.indices) {
                bindings[i].apply(timeMs, eased)
            }
        }
        addListener(listener)
        addPauseListener(listener)
        rootTransition.addListener(listener)
    }
}

/**
 * Fans the animator's and the root transition's lifecycle out to the bindings: start and
 * resume add what must be on screen, pause takes it away, and the ends restore the rest
 * values. The transition's end and cancel restore unconditionally: a seeked animator is never
 * started, so a canceled transition delivers no animator callback.
 */
private class TimelineAnimatorListener(
    private val bindings: Array<TrackBinding>,
) : AnimatorListenerAdapter(),
    Transition.TransitionListener {
    override fun onAnimationStart(animation: Animator) = forEach { it.onStart() }

    override fun onAnimationStart(
        animation: Animator,
        isReverse: Boolean,
    ) = forEach { it.onStart() }

    override fun onAnimationResume(animation: Animator) = forEach { it.onStart() }

    override fun onAnimationPause(animation: Animator) = forEach { it.onPause() }

    override fun onAnimationEnd(animation: Animator) = forEach { it.restore() }

    override fun onAnimationEnd(
        animation: Animator,
        isReverse: Boolean,
    ) {
        // A reversed end is a canceled gesture's spring reaching the start; the forward replay
        // that follows ends the animator again and restores. Same guard as `Visibility`'s own
        // listeners, so the bindings stay in step with its overlay bookkeeping.
        if (!isReverse) forEach { it.restore() }
    }

    override fun onAnimationCancel(animation: Animator) = forEach { it.restore() }

    override fun onTransitionStart(transition: Transition) = Unit

    override fun onTransitionEnd(transition: Transition) {
        forEach { it.restore() }
        transition.removeListener(this)
    }

    override fun onTransitionEnd(
        transition: Transition,
        isReverse: Boolean,
    ) = onTransitionEnd(transition)

    override fun onTransitionCancel(transition: Transition) = forEach { it.restore() }

    override fun onTransitionPause(transition: Transition) = Unit

    override fun onTransitionResume(transition: Transition) = Unit

    private inline fun forEach(action: (TrackBinding) -> Unit) {
        for (i in bindings.indices) action(bindings[i])
    }
}
