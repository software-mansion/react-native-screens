package com.swmansion.rnscreens.gamma.stack.header.toolbar

import android.view.MenuItem.SHOW_AS_ACTION_ALWAYS
import android.view.MenuItem.SHOW_AS_ACTION_IF_ROOM
import android.view.MenuItem.SHOW_AS_ACTION_NEVER
import android.view.MenuItem.SHOW_AS_ACTION_WITH_TEXT

internal enum class StackHeaderToolbarMenuItemShowAsAction {
    ALWAYS,
    ALWAYS_WITH_TEXT,
    IF_ROOM,
    IF_ROOM_WITH_TEXT,
    NEVER,
    ;

    internal fun toNativeShowAsAction(): Int =
        when (this) {
            ALWAYS -> SHOW_AS_ACTION_ALWAYS
            ALWAYS_WITH_TEXT -> SHOW_AS_ACTION_ALWAYS or SHOW_AS_ACTION_WITH_TEXT
            IF_ROOM -> SHOW_AS_ACTION_IF_ROOM
            IF_ROOM_WITH_TEXT -> SHOW_AS_ACTION_IF_ROOM or SHOW_AS_ACTION_WITH_TEXT
            NEVER -> SHOW_AS_ACTION_NEVER
        }
}
