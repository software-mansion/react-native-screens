package com.swmansion.rnscreens.gamma.stack.header.configuration

import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding

internal interface StackHeaderConfigurationProviding {
    val type: StackHeaderType
    val title: String
    val hidden: Boolean
    val transparent: Boolean
    val leftSubview: StackHeaderSubviewProviding?
    val centerSubview: StackHeaderSubviewProviding?
    val rightSubview: StackHeaderSubviewProviding?
    val backgroundSubview: StackHeaderSubviewProviding?

    fun updateHeaderFrame(width: Int, height: Int, contentOffsetY: Int)
}
