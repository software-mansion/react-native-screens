package com.swmansion.rnscreens.gamma.tabs

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

class TabScreenFragment(
    internal val tabScreen: TabScreen,
) : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = tabScreen

    override fun onStart() {
        tabScreen.eventEmitter.emitOnWillAppear()
        super.onStart()
    }

    override fun onResume() {
        tabScreen.eventEmitter.emitOnDidAppear()
        super.onResume()
    }

    override fun onPause() {
        tabScreen.eventEmitter.emitOnWillDisappear()
        super.onPause()
    }

    override fun onStop() {
        tabScreen.eventEmitter.emitOnDidDisappear()
        super.onStop()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        // Handle theme change through RN's Appearance.setColorScheme
        tabScreen.onFragmentConfigurationChange(this, newConfig)
    }
}
