package com.swmansion.rnscreens.core.containers.tabs.item

import androidx.fragment.app.FragmentManager
import java.util.WeakHashMap

/**
 * Tracks, per [FragmentManager], the [TabsScreenFragment] lifecycle callbacks in progress.
 *
 * A fragment manager runs the lifecycle callbacks of its fragments while it executes a state change
 * (`dispatchStart`, `dispatchResume`, `dispatchPause`, `dispatchStop`), and throws "FragmentManager
 * is already executing transactions" when a transaction is committed to it in the meantime. The
 * appearance events emitted from these callbacks can be dispatched synchronously and mount pending
 * React transactions on the spot (e.g. when Reanimated handles them). Containers check this tracker
 * to postpone their fragment transactions until the callback returns.
 *
 * It is keyed by fragment manager because several containers can share one.
 *
 * Main thread only.
 */
internal object TabsScreenFragmentLifecycleTracker {
    private val callbackDepthByFragmentManager = WeakHashMap<FragmentManager, Int>()

    fun onCallbackStarted(fragmentManager: FragmentManager) {
        callbackDepthByFragmentManager[fragmentManager] = (callbackDepthByFragmentManager[fragmentManager] ?: 0) + 1
    }

    fun onCallbackFinished(fragmentManager: FragmentManager) {
        val depth = (callbackDepthByFragmentManager[fragmentManager] ?: 0) - 1
        if (depth > 0) {
            callbackDepthByFragmentManager[fragmentManager] = depth
        } else {
            callbackDepthByFragmentManager.remove(fragmentManager)
        }
    }

    /**
     * Whether a [TabsScreenFragment] of [fragmentManager] is running a lifecycle callback, i.e.
     * whether a transaction committed to [fragmentManager] now would throw.
     */
    fun isRunningCallback(fragmentManager: FragmentManager): Boolean = callbackDepthByFragmentManager.containsKey(fragmentManager)
}
