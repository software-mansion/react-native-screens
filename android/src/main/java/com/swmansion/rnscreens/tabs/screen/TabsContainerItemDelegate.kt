package com.swmansion.rnscreens.tabs.screen

import android.content.res.Configuration
import androidx.fragment.app.Fragment

internal interface TabsContainerItemDelegate {
    /**
     * **If a fragment is associated with the item**, notify the delegate that the fragment
     * got configuration update.
     */
    fun onFragmentConfigurationChange(
        item: TabsContainerItem,
        config: Configuration,
    )

    /**
     * This returns fragment **if one is associated with given item**.
     */
    fun getFragmentForItem(item: TabsContainerItem): Fragment?
}
