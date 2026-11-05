package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.animation.Animator
import android.view.View
import android.view.ViewGroup
import androidx.transition.TransitionValues
import androidx.transition.Visibility
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.MotionTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ZOrder

/**
 * The androidx `Visibility` of one screen: it plays that screen's motion in one operation. One
 * instance per request, never shared, holding only immutable data: FragmentManager clones it and
 * the seek controller attaches per-instance state.
 */
internal class MotionVisibility(
    internal val timeline: MotionTimeline,
    isAppearing: Boolean,
    internal val exitZOrder: ZOrder,
) : Visibility() {
    init {
        mode = if (isAppearing) MODE_IN else MODE_OUT
    }

    // `Transition.isSeekingSupported()` returns false and `Visibility` does not override it, so
    // this is what keeps predictive back enabled for the batch.
    override fun isSeekingSupported(): Boolean = true

    // For [ZOrder.UNDER] the disappearing view is hosted in the underlay's overlay, which draws under
    // the entering screen; nothing else differs from stock Visibility.
    override fun onDisappear(
        sceneRoot: ViewGroup,
        startValues: TransitionValues?,
        startVisibility: Int,
        endValues: TransitionValues?,
        endVisibility: Int,
    ): Animator? {
        val host =
            if (exitZOrder == ZOrder.UNDER) {
                (sceneRoot as? StackUnderlayProviding)?.underlay ?: sceneRoot
            } else {
                sceneRoot
            }
        return super.onDisappear(host, startValues, startVisibility, endValues, endVisibility)
    }

    // `startValues` / `endValues` are ignored: `Visibility` captures only visibility and parent, and
    // the values to animate come from the timeline.
    override fun onAppear(
        sceneRoot: ViewGroup,
        view: View,
        startValues: TransitionValues?,
        endValues: TransitionValues?,
    ): Animator = animate(view, sceneRoot)

    override fun onDisappear(
        sceneRoot: ViewGroup,
        view: View,
        startValues: TransitionValues?,
        endValues: TransitionValues?,
    ): Animator = animate(view, sceneRoot)

    private fun animate(
        view: View,
        sceneRoot: ViewGroup,
    ): Animator = createTimelineAnimator(view, timeline, LayoutMetrics.of(view, sceneRoot.containerOrSelf()), rootTransition)

    /**
     * The metrics come from the real container also when the scene root is its underlay.
     */
    private fun ViewGroup.containerOrSelf(): ViewGroup {
        val parent = parent as? ViewGroup
        return if (parent is StackUnderlayProviding && parent.underlay === this) parent else this
    }
}
