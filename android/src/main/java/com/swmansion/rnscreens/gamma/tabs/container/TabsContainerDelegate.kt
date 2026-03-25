package com.swmansion.rnscreens.gamma.tabs.container

internal interface TabsContainerDelegate {
    fun onNavStateUpdate(
        navState: TabsNavState,
        isRepeated: Boolean,
        hasTriggeredSpecialEffect: Boolean,
        isNativeAction: Boolean,
    )
}
