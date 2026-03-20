package com.swmansion.rnscreens.gamma.stack.header.configuration

internal fun interface StackHeaderConfigurationAttachObserver {
    fun onHeaderConfigurationChanged(config: StackHeaderConfiguration?)
}
