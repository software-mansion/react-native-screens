package com.swmansion.rnscreens.gamma.stack.header.configuration

internal fun interface StackHeaderConfigurationChangeListener {
    fun onHeaderConfigurationChanged(config: StackHeaderConfigurationProviding)
}
