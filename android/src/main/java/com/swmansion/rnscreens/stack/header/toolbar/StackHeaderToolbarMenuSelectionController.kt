package com.swmansion.rnscreens.stack.header.toolbar

import android.util.Log
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuGroupMetadata

/**
 * Owns toolbar-menu selection state (id map + group metadata) and applies
 * group-item checked-state changes.
 */
internal class StackHeaderToolbarMenuSelectionController {
    internal var forwardIdMap: Map<String, Int> = emptyMap()
        private set

    private var groupMetadata: StackHeaderToolbarMenuGroupMetadata = StackHeaderToolbarMenuGroupMetadata.EMPTY

    internal fun setMenuMaps(
        forwardIdMap: Map<String, Int>,
        groupMetadata: StackHeaderToolbarMenuGroupMetadata,
    ) {
        this.forwardIdMap = forwardIdMap
        this.groupMetadata = groupMetadata
    }

    internal fun clear() {
        forwardIdMap = emptyMap()
        groupMetadata = StackHeaderToolbarMenuGroupMetadata.EMPTY
    }

    /**
     * Mutates the checked state of [itemId] within its group and returns the id of the group
     * whose selection changed, or `null` when nothing changed (the item is not in a group, an
     * invalid attempt to uncheck a single-selection item, or the item was already in the
     * target state). Does not emit — callers decide when to emit so that batched updates can
     * coalesce into one event per group.
     */
    internal fun applyGroupItemStateChange(
        toolbar: MaterialToolbar,
        itemId: String,
        explicitCheckedValue: Boolean? = null,
    ): String? {
        val groupId = groupMetadata.itemGroupMap[itemId] ?: return null
        val singleSelection = groupMetadata.groupSingleSelection[groupId] ?: return null
        val intId = forwardIdMap[itemId] ?: return null
        val menuItem = toolbar.menu.findItem(intId) ?: return null

        if (singleSelection && explicitCheckedValue == false) {
            Log.w(
                TAG,
                "[RNScreens] Cannot uncheck item '$itemId' in single-selection group '$groupId'. " +
                    "Check a different item instead.",
            )
            return null
        }

        val newChecked =
            if (singleSelection) {
                true
            } else {
                explicitCheckedValue ?: !menuItem.isChecked
            }
        if (menuItem.isChecked == newChecked) return null
        menuItem.isChecked = newChecked

        return groupId
    }

    internal fun collectSelectedIds(
        toolbar: MaterialToolbar,
        groupId: String,
    ): List<String> =
        groupMetadata
            .groupMemberItems[groupId]
            .orEmpty()
            .filter { memberId ->
                val intId = forwardIdMap[memberId] ?: return@filter false
                toolbar.menu.findItem(intId)?.isChecked == true
            }

    companion object {
        private const val TAG = "StackHeaderToolbarMenuSelectionController"
    }
}
