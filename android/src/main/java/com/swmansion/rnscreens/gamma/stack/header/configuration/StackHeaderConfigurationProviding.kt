package com.swmansion.rnscreens.gamma.stack.header.configuration

internal interface StackHeaderConfigurationProviding {
    val headerType: StackHeaderType
    val title: String
    val isHidden: Boolean
    val isTransparent: Boolean
}
