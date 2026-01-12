package com.swmansion.rnscreens.gamma.tabs

import android.os.Build
import android.view.MenuItem
import androidx.core.view.get
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarItemView

class TabsHostA11yCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabScreenFragments: List<TabScreenFragment>,
) {
    fun setA11yPropertiesToTabItem(
        menuItem: MenuItem,
        tabScreen: TabScreen,
    ) {
        val menuView = bottomNavigationView.findViewById<NavigationBarItemView>(menuItem.itemId)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // The setting will overwrite default item title when building a11y description
            // see https://github.com/material-components/material-components-android/blob/9cc5d57d7b5a41d0ceafa29b98d2cd6d4094d19c/lib/java/com/google/android/material/navigation/NavigationBarItemView.java#L692
            menuItem.contentDescription = tabScreen.tabBarItemAccessibilityLabel
        }

        // when matching view by id, espresso driver seems to look for tag property
        menuView.tag = tabScreen.tabBarItemTestID
    }

    fun setA11yPropertiesToAllTabItems() {
        tabScreenFragments.forEachIndexed { index, fragment ->
            val menuItem = bottomNavigationView.menu[index]
            setA11yPropertiesToTabItem(menuItem, fragment.tabScreen)
        }
    }
}
