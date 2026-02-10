package com.swmansion.rnscreens.gamma.tabs

import android.content.res.Configuration
import androidx.fragment.app.Fragment

internal interface TabScreenDelegate {
    fun onTabFocusChangedFromJS(
        tabScreen: TabScreen,
        isFocused: Boolean,
    )

    fun onMenuItemAttributesChange(tabScreen: TabScreen)

    /**
     * **If a fragment is associated with the tab screen**, notify the delegate that the fragment
     * got configuration update.
     */
    fun onFragmentConfigurationChange(
        tabScreen: TabScreen,
        config: Configuration,
    )

    /**
     * This returns fragment **if one is associated with given tab screen**.
     */
    fun getFragmentForTabScreen(tabScreen: TabScreen): Fragment?
}
