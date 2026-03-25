package com.swmansion.rnscreens.gamma.tabs.container

internal sealed class TabsContainerOp

internal data class TabChangeOp(
    val navState: TabsNavState,
) : TabsContainerOp()
