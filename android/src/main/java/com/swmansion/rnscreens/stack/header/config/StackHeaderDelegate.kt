package com.swmansion.rnscreens.stack.header.config

import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubviewType

internal interface StackHeaderDelegate {
    fun onHeaderFrameChanged(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    )

    fun onSubviewOriginChanged(
        type: StackHeaderSubviewType,
        x: Int,
        y: Int,
    )
}
