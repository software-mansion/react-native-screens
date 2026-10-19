package com.swmansion.rnscreens.core.containers.tabs.appearance

import android.content.Context
import android.view.MenuItem
import com.swmansion.rnscreens.core.common.text.FontResolver
import com.swmansion.rnscreens.core.containers.tabs.container.TabsBottomNavigationView
import com.swmansion.rnscreens.core.containers.tabs.container.TabsContainer
import com.swmansion.rnscreens.core.containers.tabs.item.TabsContainerItem
import com.swmansion.rnscreens.core.containers.tabs.item.TabsItemInvalidationFlags
import com.swmansion.rnscreens.core.containers.tabs.item.TabsScreenFragment

internal class TabsAppearanceCoordinator(
    private val bottomNavigationView: TabsBottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
    titleFontResolver: FontResolver,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(bottomNavigationView, titleFontResolver)

    private var appliedIconBoxDp: Float? = null

    // Icon box is bar-wide: the largest effective size across tabs.
    internal fun resolveIconBoxDp(): Float {
        if (tabsScreenFragments.isEmpty()) {
            return appearanceApplicator.defaultIconSizeDp
        }
        var largestIconDp = 0f
        var tallestIndicatorDp = 0f
        var shortestIndicatorDp = Float.MAX_VALUE
        tabsScreenFragments.forEach {
            largestIconDp = maxOf(largestIconDp, appearanceApplicator.effectiveIconSizeDp(it.item))
            val indicatorHeightDp = appearanceApplicator.effectiveIndicatorHeightDp(it.item)
            tallestIndicatorDp = maxOf(tallestIndicatorDp, indicatorHeightDp)
            shortestIndicatorDp = minOf(shortestIndicatorDp, indicatorHeightDp)
        }
        val unevenIndicatorsOutgrowIcons = tallestIndicatorDp > largestIconDp && tallestIndicatorDp != shortestIndicatorDp
        return if (unevenIndicatorsOutgrowIcons) tallestIndicatorDp else largestIconDp
    }

    fun updateTabAppearance(
        context: Context,
        tabsContainer: TabsContainer,
    ) {
        val selectedTabAppearance = tabsContainer.selectedTab.item.appearance
        val iconBoxDp = resolveIconBoxDp()
        if (iconBoxDp != appliedIconBoxDp) {
            appliedIconBoxDp = iconBoxDp
            bottomNavigationView.invalidateMenuItemIcons()
        }
        appearanceApplicator.applyIconBox(iconBoxDp)
        appearanceApplicator.updateSharedAppearance(context, selectedTabAppearance, tabsContainer.tabBarHidden)
        updateMenuItems(context, selectedTabAppearance, iconBoxDp)
        appearanceApplicator.updateFontStyles(context, selectedTabAppearance) // It needs to be updated after updateMenuItems
    }

    private fun updateMenuItems(
        context: Context,
        tabsAppearance: TabsAppearance?,
        iconBoxDp: Float,
    ) {
        tabsScreenFragments.forEach { fragment ->
            val menuItemId = fragment.menuItemId
            val menuItem =
                checkNotNull(bottomNavigationView.menu.findItem(menuItemId)) {
                    "[RNScreens] Missing MenuItem for id: $menuItemId"
                }
            updateMenuItemAppearance(context, menuItem, fragment.item, tabsAppearance, iconBoxDp, isWholeBarUpdate = true)
        }
    }

    /**
     * Applies the invalidated parts of a single menu item.
     *
     * @param isWholeBarUpdate Whether this runs as part of the whole-bar appearance update, which
     * re-applies every badge: badge colours come from the selected tab's appearance.
     * @return The flags that were pending for the menu item.
     */
    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        item: TabsContainerItem,
        appearance: TabsAppearance?,
        iconBoxDp: Float,
        isWholeBarUpdate: Boolean,
    ): TabsItemInvalidationFlags {
        val flags =
            appearanceApplicator.updateMenuItemAppearance(menuItem, item, bottomNavigationView.menuItemState(menuItem.itemId), iconBoxDp)
        if (isWholeBarUpdate || flags.containsAny(TabsItemInvalidationFlags.BADGE)) {
            appearanceApplicator.updateBadgeAppearance(context, menuItem, item, appearance)
        }
        return flags
    }
}
