package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding
import java.lang.ref.WeakReference

interface StackHeaderConfigProviding {
    val type: StackHeaderType
    val title: String
    val hidden: Boolean
    val transparent: Boolean
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

    var onConfigChangeListener: WeakReference<OnHeaderConfigChangeListener>?
}
