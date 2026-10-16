package com.swmansion.rnscreens.tabs.container

import android.annotation.SuppressLint
import android.content.Context
import androidx.core.view.isVisible
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.tabs.screen.TabsItemInvalidationFlags

@SuppressLint("ViewConstructor") // Should not be restored & should only be constructed by us.
class CustomBottomNavigationView(
    context: Context,
    val container: TabsContainer,
) : BottomNavigationView(context),
    ReactPointerEventsView {
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

    /**
     * The tab bar is hidden by setting its visibility to `GONE`. A `GONE` view is skipped by its
     * parent's layout pass, so it keeps the bounds it was last laid out with, and Android's own
     * touch dispatch ignores it (`ViewGroup.canViewReceivePointerEvents` requires `VISIBLE`).
     *
     * React Native does not go through Android's dispatch to pick a touch target - it runs its own
     * hit-test over the native view tree in `TouchTargetHelper`, which only checks bounds. The
     * retained bounds of the hidden bar therefore keep capturing every touch aimed at the content
     * laid out underneath it. Declaring [PointerEvents.NONE] while hidden is how a native view opts
     * out of that hit-test, which brings it back in line with Android's dispatch.
     *
     * See https://github.com/software-mansion/react-native-screens/issues/4132.
     */
    override val pointerEvents: PointerEvents
        get() = if (isVisible) PointerEvents.AUTO else PointerEvents.NONE

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

    override fun setSelectedItemId(itemId: Int) {
        if (this.actionOrigin == null) {
            this.actionOrigin = TabsActionOrigin.USER
        }

        val actionOrigin = checkNotNull(this.actionOrigin)
        super.setSelectedItemId(itemId)
        container.onAfterSetSelectedItemId(itemId, actionOrigin)

        this.actionOrigin = null
    }
}
