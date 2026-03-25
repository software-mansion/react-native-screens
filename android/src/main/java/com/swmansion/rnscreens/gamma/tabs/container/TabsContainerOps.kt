package com.swmansion.rnscreens.gamma.tabs.container

internal sealed class TabsContainerOp()

internal data class TabChangeJSOp(val selectedKey: String, val provenance: Int) : TabsContainerOp()
