package com.swmansion.rnscreens.gamma.stack.header.config

interface StackHeaderDelegate {
    fun updateHeaderFrame(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    )

    fun onMenuItemClick(id: String)
}
