package com.swmansion.rnscreens.core.containers.stack.animation.engine

import android.animation.Animator
import android.view.View
import android.view.ViewGroup
import androidx.transition.TransitionValues
import androidx.transition.Visibility
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ScreenTimeline
import com.swmansion.rnscreens.core.containers.stack.animation.timeline.ZOrder

/**
 * The androidx transition that plays one screen's timeline in one operation. One instance per
 * read, never shared, holding only immutable data: FragmentManager clones what it reads and the
 * seek controller attaches per-instance state.
 */
internal class ScreenTransition(
    internal val timeline: ScreenTimeline,
    isAppearing: Boolean,
    internal val exitZOrder: ZOrder,
) : Visibility() {
    init {
        mode = if (isAppearing) MODE_IN else MODE_OUT
    }

    // `Transition.isSeekingSupported()` returns false and `Visibility` does not override it, so
    // this is what keeps predictive back enabled for the batch.
    override fun isSeekingSupported(): Boolean = true

    // The only change versus stock Visibility is which ViewGroupOverlay hosts the disappearing
    // view: the scene root's overlay draws above every child, the underlay's draws as part of
    // child 0, i.e. under the entering screen. Everything androidx does with that overlay
    // afterward (removal at end or cancel, pause / resume / reverse while seeking) is unchanged.
    override fun onDisappear(
        sceneRoot: ViewGroup,
        startValues: TransitionValues?,
        startVisibility: Int,
        endValues: TransitionValues?,
        endVisibility: Int,
    ): Animator? {
        val host =
            if (exitZOrder == ZOrder.UNDER) {
                (sceneRoot as? UnderlayProviding)?.underlay ?: sceneRoot
            } else {
                sceneRoot
            }
        return super.onDisappear(host, startValues, startVisibility, endValues, endVisibility)
    }

    // `startValues` / `endValues` are ignored on purpose. An androidx transition normally animates
    // between the property snapshots it captured in the start and end scenes (`ChangeBounds` its
    // bounds, `Fade` its alpha); `Visibility` captures only visibility and parent, uses them to pick
    // `onAppear` or `onDisappear`, and passes the same snapshots on. Here the `from` / `to` values
    // come from the timeline and the view is at rest in both scenes, so the snapshots hold nothing
    // to animate between.
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
        return if (parent is UnderlayProviding && parent.underlay === this) parent else this
    }
}
