package com.swmansion.rnscreens.gamma.tabs

import android.content.res.Configuration
import androidx.fragment.app.Fragment

internal interface TabsScreenDelegate {
    fun onTabFocusChangedFromJS(
        tabsScreen: TabsScreen,
        isFocused: Boolean,
    )

    fun onMenuItemAttributesChange(tabsScreen: TabsScreen)

    /**
     * **If a fragment is associated with the tab screen**, notify the delegate that the fragment
     * got configuration update.
     */
    fun onFragmentConfigurationChange(
        tabsScreen: TabsScreen,
        config: Configuration,
    )

    /**
     * This returns fragment **if one is associated with given tab screen**.
     */
    fun getFragmentForTabsScreen(tabsScreen: TabsScreen): Fragment?
}
