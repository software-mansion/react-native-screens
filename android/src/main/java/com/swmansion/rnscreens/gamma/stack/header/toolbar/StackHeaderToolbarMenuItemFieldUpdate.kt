package com.swmansion.rnscreens.gamma.stack.header.toolbar

sealed interface StackHeaderToolbarMenuItemFieldUpdate<out T> {
    data object Absent : StackHeaderToolbarMenuItemFieldUpdate<Nothing>
    data object Reset : StackHeaderToolbarMenuItemFieldUpdate<Nothing>
    data class Set<T>(val value: T) : StackHeaderToolbarMenuItemFieldUpdate<T>
}
