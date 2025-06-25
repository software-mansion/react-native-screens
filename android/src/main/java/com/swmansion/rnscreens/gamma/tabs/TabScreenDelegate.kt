package com.swmansion.rnscreens.gamma.tabs

internal interface TabScreenDelegate {
    fun onTabFocusChangedFromJS(
        tabScreen: TabScreen,
        isFocused: Boolean,
    )

    fun onMenuItemAttributesChange(tabScreen: TabScreen)
}
