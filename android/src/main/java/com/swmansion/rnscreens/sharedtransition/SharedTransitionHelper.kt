package com.swmansion.rnscreens.sharedtransition

import android.transition.ChangeBounds
import android.transition.ChangeClipBounds
import android.transition.ChangeTransform
import android.transition.Fade
import android.transition.TransitionSet
import android.util.Log
import android.view.View
import android.view.ViewGroup
import androidx.core.view.ViewCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction

/**
 * Helper that wires up Android's native Fragment shared element transitions.
 *
 * It walks the view trees of the outgoing and incoming Fragments, collects
 * every [SharedTransitionView] whose `transitionName` is non-null, then
 * matches them by tag and calls [FragmentTransaction.addSharedElement].
 */
object SharedTransitionHelper {

    private const val TAG = "SharedTransitionHelper"
    private const val TRANSITION_DURATION = 400L

    /**
     * Collect all SharedTransitionViews in the given view hierarchy.
     */
    fun findSharedTransitionViews(root: View?): List<SharedTransitionView> {
        val result = mutableListOf<SharedTransitionView>()
        if (root == null) return result
        collectSharedViews(root, result)
        return result
    }

    private fun collectSharedViews(view: View, out: MutableList<SharedTransitionView>) {
        if (view is SharedTransitionView && ViewCompat.getTransitionName(view) != null) {
            out.add(view)
        }
        if (view is ViewGroup) {
            for (i in 0 until view.childCount) {
                collectSharedViews(view.getChildAt(i), out)
            }
        }
    }

    private fun createSharedElementTransitionSet(): TransitionSet {
        return TransitionSet().apply {
            addTransition(ChangeBounds())
            addTransition(ChangeTransform())
            addTransition(ChangeClipBounds())
            duration = TRANSITION_DURATION
            ordering = TransitionSet.ORDERING_TOGETHER
        }
    }

    /**
     * Creates a Fade transition for non-shared content.
     * When fading in, delays until the shared element has mostly finished animating.
     */
    private fun createContentFadeTransition(fadeIn: Boolean): Fade {
        return Fade(if (fadeIn) Fade.IN else Fade.OUT).apply {
            duration = TRANSITION_DURATION / 2
            if (fadeIn) {
                startDelay = TRANSITION_DURATION / 2
            }
        }
    }

    /**
     * Sets up shared element transitions between outgoing and incoming Fragments.
     *
     * @param isForward true for push, false for pop (back navigation)
     * @return true if at least one shared element pair was found and added.
     */
    fun setupSharedElementTransition(
        transaction: FragmentTransaction,
        outgoingFragment: Fragment?,
        incomingFragment: Fragment?,
        isForward: Boolean = true,
    ): Boolean {
        if (outgoingFragment == null || incomingFragment == null) return false

        val outgoingView = outgoingFragment.view ?: return false
        val outgoingSharedViews = findSharedTransitionViews(outgoingView)

        if (outgoingSharedViews.isEmpty()) {
            return false
        }

        Log.d(TAG, "Found ${outgoingSharedViews.size} shared views in outgoing fragment (forward=$isForward)")

        // Shared element transitions
        incomingFragment.sharedElementEnterTransition = createSharedElementTransitionSet()
        incomingFragment.sharedElementReturnTransition = createSharedElementTransitionSet()

        // Non-shared content transitions — prevents destination content from
        // bleeding through during the shared element animation
        incomingFragment.enterTransition = createContentFadeTransition(fadeIn = true)
        outgoingFragment.exitTransition = createContentFadeTransition(fadeIn = false)

        // Return (pop) transitions
        incomingFragment.returnTransition = createContentFadeTransition(fadeIn = false)
        outgoingFragment.reenterTransition = createContentFadeTransition(fadeIn = true)

        // Add each shared view to the transaction
        var addedCount = 0
        for (sharedView in outgoingSharedViews) {
            val transitionName = ViewCompat.getTransitionName(sharedView) ?: continue
            transaction.addSharedElement(sharedView, transitionName)
            addedCount++
            Log.d(TAG, "Added shared element: transitionName='$transitionName'")
        }

        return addedCount > 0
    }
}
