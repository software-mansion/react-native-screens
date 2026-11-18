package com.swmansion.rnscreens.core.containers.tabs.item

import android.content.res.Configuration

interface TabsScreenFragmentDelegate {
    /**
     * Notifies the delegate that the fragment received a configuration update,
     * e.g. theme change from JS via Appearance.setColorScheme. Fragments are
     * the only place where such updates are delivered reliably.
     */
    fun onFragmentConfigurationChanged(config: Configuration)

    /**
     * Notifies the delegate that the fragment entered one of its lifecycle callbacks.
     * The fragment manager hosting the fragment is executing a state change until the matching
     * [onFragmentLifecycleCallbackFinished], so no transaction can be committed to it until then.
     */
    fun onFragmentLifecycleCallbackStarted()

    /**
     * Notifies the delegate that the fragment left the lifecycle callback announced with
     * [onFragmentLifecycleCallbackStarted].
     */
    fun onFragmentLifecycleCallbackFinished()
}
