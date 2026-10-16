package com.swmansion.rnscreens.tabs.screen

import android.content.res.Configuration
import androidx.fragment.app.Fragment

internal interface TabsScreenDelegate {
    /**
     * **If a fragment is associated with the tab screen**, notify the delegate that the fragment
     * got configuration update.
     */
    fun onFragmentConfigurationChange(
        item: TabsContainerItem,
        config: Configuration,
    )

    /**
     * This returns fragment **if one is associated with given tab screen**.
     */
    fun getFragmentForItem(item: TabsContainerItem): Fragment?
}
