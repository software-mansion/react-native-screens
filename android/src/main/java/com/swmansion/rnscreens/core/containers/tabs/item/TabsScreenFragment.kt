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
        item.appearanceEventEmitter.emitOnWillAppear()
        super.onStart()
    }

    override fun onResume() {
        item.appearanceEventEmitter.emitOnDidAppear()
        super.onResume()
    }

    override fun onPause() {
        item.appearanceEventEmitter.emitOnWillDisappear()
        super.onPause()
    }

    override fun onStop() {
        item.appearanceEventEmitter.emitOnDidDisappear()
        super.onStop()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        // Handle theme change through RN's Appearance.setColorScheme
        delegate.get()?.onFragmentConfigurationChanged(newConfig)
    }
}
