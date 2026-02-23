package com.swmansion.rnscreens.gamma.tabs

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

class TabsScreenFragment(
    internal val tabsScreen: TabsScreen,
) : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = tabsScreen

    override fun onStart() {
        tabsScreen.eventEmitter.emitOnWillAppear()
        super.onStart()
    }

    override fun onResume() {
        tabsScreen.eventEmitter.emitOnDidAppear()
        super.onResume()
    }

    override fun onPause() {
        tabsScreen.eventEmitter.emitOnWillDisappear()
        super.onPause()
    }

    override fun onStop() {
        tabsScreen.eventEmitter.emitOnDidDisappear()
        super.onStop()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        // Handle theme change through RN's Appearance.setColorScheme
        tabsScreen.onFragmentConfigurationChange(this, newConfig)
    }
}
