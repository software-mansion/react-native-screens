package com.swmansion.rnscreens.tabs.screen

import android.content.res.Configuration

interface TabsScreenFragmentDelegate {
    /**
     * Notifies the delegate that the fragment received a configuration update,
     * e.g. theme change from JS via Appearance.setColorScheme. Fragments are
     * the only place where such updates are delivered reliably.
     */
    fun onFragmentConfigurationChanged(config: Configuration)
}
