package com.swmansion.rnscreens.gamma.stack.header.config

internal fun interface OnHeaderConfigurationAttachListener {
    fun onHeaderConfigAttach(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    )
}
