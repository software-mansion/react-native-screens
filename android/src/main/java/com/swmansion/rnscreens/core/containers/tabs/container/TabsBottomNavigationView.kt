package com.swmansion.rnscreens.core.containers.tabs.container

import android.annotation.SuppressLint
import android.content.Context
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.core.containers.tabs.item.TabsItemInvalidationFlags

/**
 * The tab bar of [TabsContainer]. Hosts may subclass it to integrate with their view system;
 * the container creates it through the factory it is given.
 */
@SuppressLint("ViewConstructor") // Should not be restored & should only be constructed by us.
open class TabsBottomNavigationView(
    context: Context,
    val container: TabsContainer,
) : BottomNavigationView(context) {
    private var actionOrigin: TabsActionOrigin? = null

    // region Menu item state

    private val menuItemStates = HashMap<Int, TabsMenuItemState>()

    internal fun menuItemState(menuItemId: Int): TabsMenuItemState = menuItemStates.getOrPut(menuItemId) { TabsMenuItemState() }

    internal fun invalidateMenuItem(
        menuItemId: Int,
        flags: TabsItemInvalidationFlags,
    ) {
        val state = menuItemState(menuItemId)
        state.pendingFlags = state.pendingFlags or flags
    }

    internal fun invalidateMenuItemIcons() {
        menuItemStates.values.forEach { it.pendingFlags = it.pendingFlags or TabsItemInvalidationFlags.ICON }
    }

    /**
     * Rebuilt menu items have nothing applied, so their fresh states are fully dirty. This also drops
     * the states of removed tabs.
     */
    internal fun resetMenuItemStates() {
        menuItemStates.clear()
    }

    // endregion

    internal fun setSelectedItemIdWithActionOrigin(
        itemId: Int,
        actionOrigin: TabsActionOrigin,
    ) {
        require(actionOrigin !== TabsActionOrigin.USER) {
            "[RNScreens] User-triggered actions should be processed via regular setSelectedItemId callback"
        }
        this.actionOrigin = actionOrigin
        selectedItemId = itemId
        this.actionOrigin = null
    }

    final override fun setSelectedItemId(itemId: Int) {
        if (this.actionOrigin == null) {
            this.actionOrigin = TabsActionOrigin.USER
        }

        val actionOrigin = checkNotNull(this.actionOrigin)
        super.setSelectedItemId(itemId)
        container.onAfterSetSelectedItemId(itemId, actionOrigin)

        this.actionOrigin = null
    }
}
