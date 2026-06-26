package com.swmansion.rnscreens.gamma.stack.header.toolbar

internal data class StackHeaderToolbarMenuGroupMetadata(
    val itemGroupMap: Map<String, String>,
    val groupSingleSelection: Map<String, Boolean>,
    val groupMemberItems: Map<String, List<String>>,
) {
    companion object {
        val EMPTY =
            StackHeaderToolbarMenuGroupMetadata(
                emptyMap(),
                emptyMap(),
                emptyMap(),
            )
    }
}
