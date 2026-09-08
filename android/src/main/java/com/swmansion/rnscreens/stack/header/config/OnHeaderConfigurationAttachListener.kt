package com.swmansion.rnscreens.stack.header.config

internal fun interface OnHeaderConfigurationAttachListener {
    fun onHeaderConfigAttached(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    )
}
