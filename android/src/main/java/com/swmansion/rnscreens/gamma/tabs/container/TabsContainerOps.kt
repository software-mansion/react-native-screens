package com.swmansion.rnscreens.gamma.tabs.container

internal sealed class TabsContainerOp

internal data class TabChangeJSOp(
    val navState: TabsNavState,
) : TabsContainerOp()
