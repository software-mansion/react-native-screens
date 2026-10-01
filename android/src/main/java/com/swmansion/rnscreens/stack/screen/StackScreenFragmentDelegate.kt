package com.swmansion.rnscreens.stack.screen

import android.content.res.Configuration

internal interface StackScreenFragmentDelegate {
    /**
     * Notifies the delegate that the fragment received a configuration update,
     * e.g. theme change from JS via Appearance.setColorScheme. Fragments are
     * the only place where such updates are delivered reliably.
     */
    fun onFragmentConfigurationChanged(config: Configuration)
}
