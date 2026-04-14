package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding

interface StackHeaderConfigProviding {
    val type: StackHeaderType
    val title: String
    val hidden: Boolean
    val transparent: Boolean
    val backButtonHidden: Boolean
    val leadingSubview: StackHeaderSubviewProviding?
    val centerSubview: StackHeaderSubviewProviding?
    val trailingSubview: StackHeaderSubviewProviding?
    val backgroundSubview: StackHeaderSubviewProviding?

    val isRTL: Boolean

    fun updateHeaderFrame(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    )

    fun setOnConfigChangeListener(listener: OnHeaderConfigChangeListener?)
}
