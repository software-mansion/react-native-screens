package com.swmansion.rnscreens.core.containers.tabs.appearance

import android.content.Context
import android.view.MenuItem
import com.swmansion.rnscreens.core.common.text.FontResolver
import com.swmansion.rnscreens.core.containers.tabs.container.TabsBottomNavigationView
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

    /**
     * The icon box the menu items are sized in: the one applied by the last [updateIconBox].
     */
    internal val iconBoxDp: Float
        get() = appliedIconBoxDp ?: resolveIconBoxDp()

    // Icon box is bar-wide: the largest effective size across tabs.
    private fun resolveIconBoxDp(): Float {
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

    /**
     * Applies the icon box shared by all menu items. Menu items whose icons depend on a changed icon
     * box are invalidated.
     */
    internal fun updateIconBox() {
        val iconBoxDp = resolveIconBoxDp()
        if (iconBoxDp != appliedIconBoxDp) {
            appliedIconBoxDp = iconBoxDp
            bottomNavigationView.invalidateAllMenuItems(TabsItemInvalidationFlags.ICON)
        }
        appearanceApplicator.applyIconBox(iconBoxDp)
    }

    internal fun updateTabBarVisibility(isTabBarHidden: Boolean) {
        appearanceApplicator.applyTabBarVisibility(isTabBarHidden)
    }

    internal fun updateSharedAppearance(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        appearanceApplicator.updateSharedAppearance(context, appearance)
    }

    internal fun updateFontStyles(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        appearanceApplicator.updateFontStyles(context, appearance)
    }

    /**
     * Applies the parts of a single menu item's appearance that [flags] invalidate. The caller
     * consumed [flags] from the menu item's state.
     */
    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        item: TabsContainerItem,
        appearance: TabsAppearance?,
        iconBoxDp: Float,
        flags: TabsItemInvalidationFlags,
    ) {
        if (flags.containsAny(TabsItemInvalidationFlags.TITLE)) {
            appearanceApplicator.applyTitle(menuItem, item)
        }

        if (flags.containsAny(TabsItemInvalidationFlags.ICON or TabsItemInvalidationFlags.ICON_SIZE)) {
            appearanceApplicator.applyIcon(menuItem, item, iconBoxDp)
        }

        if (flags.containsAny(TabsItemInvalidationFlags.ICON_SIZE or TabsItemInvalidationFlags.ACTIVE_INDICATOR_SIZE)) {
            if (!appearanceApplicator.applyActiveIndicatorSize(menuItem, item, bottomNavigationView.menuItemState(menuItem.itemId))) {
                // The menu item's view doesn't exist yet; keep it pending for the menu item's next update.
                bottomNavigationView.invalidateMenuItem(menuItem.itemId, TabsItemInvalidationFlags.ACTIVE_INDICATOR_SIZE)
            }
        }

        if (flags.containsAny(TabsItemInvalidationFlags.BADGE)) {
            appearanceApplicator.updateBadgeAppearance(context, menuItem, item, appearance)
        }
    }
}
