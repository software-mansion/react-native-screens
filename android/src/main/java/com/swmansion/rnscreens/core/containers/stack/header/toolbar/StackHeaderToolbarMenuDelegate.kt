package com.swmansion.rnscreens.core.containers.stack.header.toolbar

internal interface StackHeaderToolbarMenuDelegate {
    fun onMenuItemClicked(id: String)

    fun onGroupSelectionChanged(
        groupId: String,
        selectedIds: List<String>,
    )
}
