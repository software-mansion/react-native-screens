package com.swmansion.rnscreens.core.containers.stack.header.config

internal fun interface OnHeaderConfigurationAttachListener {
    fun onHeaderConfigAttached(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    )
}
