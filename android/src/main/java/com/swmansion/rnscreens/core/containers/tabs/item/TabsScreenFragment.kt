package com.swmansion.rnscreens.core.containers.tabs.item

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import java.lang.ref.WeakReference

class TabsScreenFragment internal constructor(
    internal val item: TabsContainerItem,
    internal val menuItemId: Int,
    private val delegate: WeakReference<TabsScreenFragmentDelegate>,
) : Fragment() {
    internal val requireItemKey: String
        get() = checkNotNull(item.itemKey) { "[RNScreens] itemKey MUST NOT be null" }
    internal val isPreventNativeSelectionEnabled: Boolean by item::preventNativeSelection

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = item.view

    override fun onStart() {
        runInLifecycleCallback { item.appearanceEventEmitter.emitOnWillAppear() }
        super.onStart()
    }

    override fun onResume() {
        runInLifecycleCallback { item.appearanceEventEmitter.emitOnDidAppear() }
        super.onResume()
    }

    override fun onPause() {
        runInLifecycleCallback { item.appearanceEventEmitter.emitOnWillDisappear() }
        super.onPause()
    }

    override fun onStop() {
        runInLifecycleCallback { item.appearanceEventEmitter.emitOnDidDisappear() }
        super.onStop()
    }

    /**
     * The appearance events are emitted while the fragment manager executes a state change. Their
     * dispatch can be synchronous and mount pending React transactions on the spot (e.g. when
     * Reanimated handles the event), so containers must not commit to that fragment manager until
     * the callback returns. See [TabsScreenFragmentLifecycleTracker].
     */
    private inline fun runInLifecycleCallback(block: () -> Unit) {
        val fragmentManager = parentFragmentManager
        TabsScreenFragmentLifecycleTracker.onCallbackStarted(fragmentManager)
        try {
            block()
        } finally {
            TabsScreenFragmentLifecycleTracker.onCallbackFinished(fragmentManager)
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        // Handle theme change through RN's Appearance.setColorScheme
        delegate.get()?.onFragmentConfigurationChanged(newConfig)
    }
}
