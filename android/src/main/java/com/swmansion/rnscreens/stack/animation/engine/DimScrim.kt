package com.swmansion.rnscreens.stack.animation.engine

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.view.View
import android.view.ViewGroup
import androidx.transition.Transition
import com.swmansion.rnscreens.stack.animation.spec.DimSpec

/**
 * A scrim over one screen, hosted in that screen's own overlay so it draws above the screen's
 * content and below its siblings. Its alpha is a function of the slot's master time; the
 * listeners mirror androidx `Visibility.OverlayListener`, so the scrim is added and removed
 * exactly when the seek controller starts, pauses, reverses, ends or cancels the transition.
 */
internal class DimScrim(
    private val host: ViewGroup,
    private val spec: DimSpec,
) {
    private val view =
        View(host.context).apply {
            setBackgroundColor(spec.color)
            alpha = spec.from
        }
    private val interpolator = spec.easing.toInterpolator(host.context)

    fun apply(timeMs: Float) {
        view.alpha = spec.from + (spec.to - spec.from) * interpolator.getInterpolation(spec.fractionAt(timeMs))
    }

    fun attachTo(
        animator: Animator,
        rootTransition: Transition,
    ) {
        val listener = Listener()
        animator.addListener(listener)
        animator.addPauseListener(listener)
        rootTransition.addListener(listener)
    }

    private fun add() {
        view.layout(0, 0, host.width, host.height)
        host.overlay.add(view)
    }

    private fun remove() {
        host.overlay.remove(view)
        view.alpha = spec.from
    }

    private inner class Listener :
        AnimatorListenerAdapter(),
        Transition.TransitionListener {
        override fun onAnimationStart(animation: Animator) = add()

        override fun onAnimationStart(
            animation: Animator,
            isReverse: Boolean,
        ) = add()

        override fun onAnimationEnd(animation: Animator) = remove()

        override fun onAnimationEnd(
            animation: Animator,
            isReverse: Boolean,
        ) {
            if (!isReverse) remove()
        }

        override fun onAnimationPause(animation: Animator) = remove()

        override fun onAnimationResume(animation: Animator) = add()

        override fun onTransitionStart(transition: Transition) = Unit

        override fun onTransitionEnd(transition: Transition) {
            remove()
            transition.removeListener(this)
        }

        override fun onTransitionCancel(transition: Transition) = remove()

        override fun onTransitionPause(transition: Transition) = Unit

        override fun onTransitionResume(transition: Transition) = Unit
    }
}
