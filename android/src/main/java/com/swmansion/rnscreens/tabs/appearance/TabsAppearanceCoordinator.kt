package com.swmansion.rnscreens.tabs.appearance

import android.content.Context
import android.view.MenuItem
import com.swmansion.rnscreens.tabs.container.CustomBottomNavigationView
import com.swmansion.rnscreens.tabs.container.TabsContainer
import com.swmansion.rnscreens.tabs.screen.TabsContainerItem
import com.swmansion.rnscreens.tabs.screen.TabsScreenFragment

internal class TabsAppearanceCoordinator(
    private val bottomNavigationView: CustomBottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
    titleFontResolver: TabsTitleFontResolver,
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
            updateMenuItemAppearance(context, menuItem, fragment.item, tabsAppearance, iconBoxDp)
        }
    }

    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        item: TabsContainerItem,
        appearance: TabsAppearance?,
        iconBoxDp: Float,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, item, bottomNavigationView.menuItemState(menuItem.itemId), iconBoxDp)
        appearanceApplicator.updateBadgeAppearance(context, menuItem, item, appearance)
    }
}
