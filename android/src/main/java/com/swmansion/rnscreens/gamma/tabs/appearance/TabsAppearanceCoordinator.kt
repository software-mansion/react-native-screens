package com.swmansion.rnscreens.gamma.tabs.appearance

import android.content.Context
import android.view.MenuItem
import androidx.core.view.get
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.gamma.tabs.container.TabsContainer
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreenFragment

internal class TabsAppearanceCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: MutableList<TabsScreenFragment>,
) {
    private val appearanceApplicator = TabsAppearanceApplicator(bottomNavigationView)

    fun updateTabAppearance(
        context: Context,
        tabsContainer: TabsContainer,
    ) {
        val selectedTabAppearance = tabsContainer.selectedTab.tabsScreen.appearance
        appearanceApplicator.updateSharedAppearance(context, selectedTabAppearance, tabsContainer.tabBarHidden)
        updateMenuItems(context, selectedTabAppearance)
        appearanceApplicator.updateFontStyles(context, selectedTabAppearance) // It needs to be updated after updateMenuItems
    }

    // THIS MUST BE CALLED BEFORE WE UPDATE THE CONTAINER, WTF
    // WE CAN NOT FIRST UPDATE THE CONTAINER AND JUST LATER CREATE THE MENU ITEMS
    // IT DOES NOT MAKE SENSE.
    //
    // I see two options. We can either create menu items, update model & fragment manager and just
    // then update appearance, OR create menu items, update mode, update apperance and just them update fragment manager.
    // I think first option is better in case we ever want to make the container update asynchronous
    // (via commitAllowingStateLoss), however the appearance update should be synchronous in relation
    // to update of fragment manager state, to ensure visual consistency.
    private fun updateMenuItems(
        context: Context,
        tabsAppearance: TabsAppearance?,
    ) {
        tabsScreenFragments.forEachIndexed { index, fragment ->
            val menuItem =
                checkNotNull(bottomNavigationView.menu.findItem(index + 1)) {
                    "[RNScreens] Missing MenuItem for id: ${index + 1}"
                }
            check(menuItem.itemId == index + 1) { "[RNScreens] Illegal state: menu items are shuffled" }
            updateMenuItemAppearance(context, menuItem, fragment.tabsScreen, tabsAppearance)
        }
    }

    internal fun updateMenuItemAppearance(
        context: Context,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabsScreen)
        appearanceApplicator.updateBadgeAppearance(context, menuItem, tabsScreen, appearance)
    }
}
