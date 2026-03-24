package com.swmansion.rnscreens.gamma.stack.header.subview

import android.view.View

interface StackHeaderSubviewProviding {
    val type: StackHeaderSubviewType
    val collapseMode: StackHeaderSubviewCollapseMode
    val view: View

    fun updateContentOriginOffset(
        x: Int,
        y: Int,
    )
}
