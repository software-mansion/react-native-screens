package com.swmansion.rnscreens.core.containers.tabs.container

import android.annotation.SuppressLint
import android.content.Context
import android.view.MenuItem
import android.view.View
import android.view.ViewTreeObserver
import androidx.core.view.children
import com.google.android.material.R
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

    internal fun findMenuItem(menuItemId: Int): MenuItem? = menu.findItem(menuItemId)

    internal fun requireMenuItem(menuItemId: Int): MenuItem =
        checkNotNull(findMenuItem(menuItemId)) { "[RNScreens] Missing MenuItem for id: $menuItemId" }

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

    internal fun invalidateAllMenuItems(flags: TabsItemInvalidationFlags) {
        menuItemStates.values.forEach { it.pendingFlags = it.pendingFlags or flags }
    }

    /**
     * Rebuilt menu items have nothing applied, so their fresh states are fully dirty. This also drops
     * the states of removed tabs.
     */
    internal fun resetMenuItemStates() {
        menuItemStates.clear()
    }

    // endregion

    // region Active indicator bounds

    /**
     * Material masks each item's ripple with the item's active indicator drawable, so laying out the
     * ripple resizes that drawable to the icon container. The active indicator view resizes its
     * background only when its own size changes, so with an icon box larger than the active indicator
     * it would draw the indicator as tall as the icon box. This puts the bounds back before each draw.
     */
    private val activeIndicatorBoundsRestorer =
        ViewTreeObserver.OnPreDrawListener {
            restoreActiveIndicatorBounds()
            true
        }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        viewTreeObserver.addOnPreDrawListener(activeIndicatorBoundsRestorer)
    }

    override fun onDetachedFromWindow() {
        viewTreeObserver.removeOnPreDrawListener(activeIndicatorBoundsRestorer)
        super.onDetachedFromWindow()
    }

    private fun restoreActiveIndicatorBounds() {
        menuViewGroup.children.forEach { itemView ->
            val indicatorView = itemView.findViewById<View>(R.id.navigation_bar_item_active_indicator_view) ?: return@forEach
            val indicator = indicatorView.background ?: return@forEach
            val width = indicatorView.width
            val height = indicatorView.height
            val bounds = indicator.bounds
            if (width == 0 || height == 0 || (bounds.left == 0 && bounds.top == 0 && bounds.right == width && bounds.bottom == height)) {
                return@forEach
            }
            indicator.setBounds(0, 0, width, height)
            // The drawable reports changes to the ripple, not to the indicator view.
            indicatorView.invalidate()
        }
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
