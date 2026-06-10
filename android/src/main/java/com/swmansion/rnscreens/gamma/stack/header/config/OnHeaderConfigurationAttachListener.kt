package com.swmansion.rnscreens.gamma.stack.header.config

internal fun interface OnHeaderConfigurationAttachListener {
    fun onHeaderConfigAttached(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    )
}
