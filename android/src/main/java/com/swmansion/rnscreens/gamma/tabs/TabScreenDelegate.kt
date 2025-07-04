package com.swmansion.rnscreens.gamma.tabs

import androidx.fragment.app.Fragment

internal interface TabScreenDelegate {
    fun onTabFocusChangedFromJS(
        tabScreen: TabScreen,
        isFocused: Boolean,
    )

    fun onMenuItemAttributesChange(tabScreen: TabScreen)

    /**
     * This returns fragment **if one is associated with given tab screen**.
     */
    fun getFragmentForTabScreen(tabScreen: TabScreen): Fragment?
}
