package com.swmansion.rnscreens.gamma.stack.header.configuration

import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview

internal interface StackHeaderConfigurationProviding {
    val type: StackHeaderType
    val title: String
    val hidden: Boolean
    val transparent: Boolean
    val leftSubview: StackHeaderSubview?
    val centerSubview: StackHeaderSubview?
    val rightSubview: StackHeaderSubview?
}
