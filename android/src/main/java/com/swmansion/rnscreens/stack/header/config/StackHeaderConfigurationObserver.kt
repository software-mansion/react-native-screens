package com.swmansion.rnscreens.stack.header.config

internal interface StackHeaderConfigurationObserver {
    fun onConfigChanged(config: StackHeaderConfigurationProviding)
}
