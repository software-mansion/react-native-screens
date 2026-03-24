package com.swmansion.rnscreens.gamma.stack.header.configuration

import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding

internal interface StackHeaderConfigurationProviding {
    val type: StackHeaderType
    val title: String
    val hidden: Boolean
    val transparent: Boolean
    val leadingSubview: StackHeaderSubviewProviding?
    val centerSubview: StackHeaderSubviewProviding?
    val trailingSubview: StackHeaderSubviewProviding?
    val backgroundSubview: StackHeaderSubviewProviding?

    val isRtl: Boolean

    fun updateHeaderFrame(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    )
}
