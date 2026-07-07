package com.swmansion.rnscreens.gamma.stack.header.config

import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType

internal interface StackHeaderDelegate {
    fun onHeaderFrameChanged(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    )

    fun onMenuItemClicked(id: String)

    fun onGroupSelectionChanged(
        groupId: String,
        selectedIds: List<String>,
    )

    fun onSubviewOriginChanged(
        type: StackHeaderSubviewType,
        x: Int,
        y: Int,
    )
}
