package com.swmansion.rnscreens.gamma.stack.header.toolbar

import com.facebook.react.bridge.ReadableMap

sealed interface StackHeaderToolbarMenuItemFieldUpdate<out T> {
    data object Absent : StackHeaderToolbarMenuItemFieldUpdate<Nothing>
    data object Reset : StackHeaderToolbarMenuItemFieldUpdate<Nothing>
    data class Set<T>(val value: T) : StackHeaderToolbarMenuItemFieldUpdate<T>
}

internal fun readStringUpdate(map: ReadableMap, key: String): StackHeaderToolbarMenuItemFieldUpdate<String> =
    when {
        !map.hasKey(key) -> StackHeaderToolbarMenuItemFieldUpdate.Absent
        map.isNull(key) -> StackHeaderToolbarMenuItemFieldUpdate.Reset
        else -> StackHeaderToolbarMenuItemFieldUpdate.Set(map.getString(key)!!)
    }

internal fun readBooleanUpdate(map: ReadableMap, key: String): StackHeaderToolbarMenuItemFieldUpdate<Boolean> =
    when {
        !map.hasKey(key) -> StackHeaderToolbarMenuItemFieldUpdate.Absent
        map.isNull(key) -> StackHeaderToolbarMenuItemFieldUpdate.Reset
        else -> StackHeaderToolbarMenuItemFieldUpdate.Set(map.getBoolean(key))
    }
