package com.swmansion.rnscreens.gamma.tabs.screen

import android.content.res.Configuration
import androidx.fragment.app.Fragment

internal interface TabsScreenDelegate {
    fun onAppearanceChanged(tabsScreen: TabsScreen)

    fun onMenuItemAttributesChange(tabsScreen: TabsScreen)

    /**
     * The icon box is bar-wide, so an icon size change requires a whole-bar appearance
     * update regardless of tab selection.
     */
    fun onIconSizeChange(tabsScreen: TabsScreen)

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
