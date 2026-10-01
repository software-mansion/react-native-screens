package com.swmansion.rnscreens.tabs.host

import android.os.Build
import android.view.MenuItem
import android.view.View
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.ViewCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import androidx.core.view.children
import androidx.core.view.get
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.swmansion.rnscreens.tabs.screen.TabsScreen
import com.swmansion.rnscreens.tabs.screen.TabsScreenFragment

class TabsHostA11yCoordinator(
    private val bottomNavigationView: BottomNavigationView,
    private val tabsScreenFragments: List<TabsScreenFragment>,
) {
    fun setA11yPropertiesToTabItem(
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // The setting will overwrite default item title when building a11y description
            // see https://github.com/material-components/material-components-android/blob/9cc5d57d7b5a41d0ceafa29b98d2cd6d4094d19c/lib/java/com/google/android/material/navigation/NavigationBarItemView.java#L692
            menuItem.contentDescription = tabsScreen.tabBarItemAccessibilityLabel
        }

        findTabItemView(menuItem.itemId)?.let { tabItemView ->
            // when matching view by id, espresso driver seems to look for tag property
            tabItemView.tag = tabsScreen.tabBarItemTestID

            // UiAutomator-based drivers (Maestro, Appium) read the node's viewIdResourceName instead,
            // so expose the testID there as well — this is what React Native's ReactAccessibilityDelegate
            // does for every other view. Read through to the screen so a prop update is reflected.
            ViewCompat.setAccessibilityDelegate(
                tabItemView,
                object : AccessibilityDelegateCompat() {
                    override fun onInitializeAccessibilityNodeInfo(
                        host: View,
                        info: AccessibilityNodeInfoCompat,
                    ) {
                        super.onInitializeAccessibilityNodeInfo(host, info)
                        info.viewIdResourceName = tabsScreen.tabBarItemTestID
                    }
                },
            )
        }
    }

    // Third-party SDKs can freely assign their own ids to id-less views in CustomBottomNavigationView's subtree and there is no way to
    // coordinate that id space with them, so we should search ids only inside Material's menu items scope.
    private fun findTabItemView(menuItemId: Int): View? = bottomNavigationView.menuViewGroup.children.firstOrNull { it.id == menuItemId }

    fun setA11yPropertiesToAllTabItems() {
        tabsScreenFragments.forEachIndexed { index, fragment ->
            val menuItem = bottomNavigationView.menu[index]
            setA11yPropertiesToTabItem(menuItem, fragment.tabsScreen)
        }
    }
}
