package com.swmansion.rnscreens.gamma.tabs.container

internal sealed class TabsContainerOp

internal data class TabSelectOp(
    val navState: TabsNavState,
) : TabsContainerOp()
