package com.swmansion.rnscreens.gamma.tabs

import android.view.MenuItem
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.view.children
import com.google.android.material.bottomnavigation.BottomNavigationView

class TabsHostAppearanceCoordinator(context: ContextThemeWrapper, bottomNavigationView: BottomNavigationView, tabsHost: TabsHost) {
    private val appearanceApplicator = TabsHostAppearanceApplicator(context, bottomNavigationView, tabsHost)

    fun updateTabAppearance() {
        appearanceApplicator.updateSharedAppearance()
        appearanceApplicator.updateFontStyles()
    }

    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabScreen: TabScreen,
    ) {
        appearanceApplicator.updateMenuItemAppearance(menuItem, tabScreen)
        appearanceApplicator.updateBadgeAppearance(menuItem, tabScreen)
    }
}