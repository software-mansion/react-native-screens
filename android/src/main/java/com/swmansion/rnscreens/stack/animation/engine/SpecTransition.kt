package com.swmansion.rnscreens.stack.animation.engine

import android.animation.Animator
import android.view.View
import android.view.ViewGroup
import androidx.transition.TransitionValues
import androidx.transition.Visibility
import com.swmansion.rnscreens.stack.animation.model.SlotRole
import com.swmansion.rnscreens.stack.animation.spec.SlotSpec
import com.swmansion.rnscreens.stack.animation.spec.ZPolicy
import com.swmansion.rnscreens.stack.host.StackContainer

/**
 * One instance per fragment transition slot. Holds no view references: FragmentManager clones
 * transitions and the seek controller attaches per-instance state.
 */
internal class SpecTransition(
    private val spec: SlotSpec,
    slot: TransitionSlot,
    private val zPolicy: ZPolicy,
) : Visibility() {
    init {
        mode = if (slot.role == SlotRole.IN) MODE_IN else MODE_OUT
    }

    override fun isSeekingSupported(): Boolean = true

    // Visibility hosts a disappearing view in the overlay of the ViewGroup passed here, and the
    // overlay of the container draws above every child. Hosting it in the underlay's overlay
    // instead draws it as part of child 0, i.e. under the entering screen.
    override fun onDisappear(
        sceneRoot: ViewGroup,
        startValues: TransitionValues?,
        startVisibility: Int,
        endValues: TransitionValues?,
        endVisibility: Int,
    ): Animator? {
        val host =
            if (zPolicy == ZPolicy.UNDER) {
                (sceneRoot as? StackContainer)?.underlay ?: sceneRoot
            } else {
                sceneRoot
            }
        return super.onDisappear(host, startValues, startVisibility, endValues, endVisibility)
    }

    override fun onAppear(
        sceneRoot: ViewGroup,
        view: View,
        startValues: TransitionValues?,
        endValues: TransitionValues?,
    ): Animator = SlotAnimator.create(view, spec, sceneRoot, rootTransition)

    override fun onDisappear(
        sceneRoot: ViewGroup,
        view: View,
        startValues: TransitionValues?,
        endValues: TransitionValues?,
    ): Animator = SlotAnimator.create(view, spec, sceneRoot, rootTransition)
}
