package com.swmansion.rnscreens.core.containers.stack.header.config

fun interface OnHeaderConfigurationAttachListener {
    fun onHeaderConfigAttached(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    )
}
