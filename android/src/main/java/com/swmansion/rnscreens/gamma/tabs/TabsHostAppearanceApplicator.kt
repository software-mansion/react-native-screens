package com.swmansion.rnscreens.gamma.tabs

import android.annotation.SuppressLint
import android.content.res.ColorStateList
import android.util.TypedValue
import android.view.MenuItem
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.view.children
import androidx.core.view.isVisible
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
class TabsHostAppearanceApplicator(
    private val context: ContextThemeWrapper,
    private val bottomNavigationView: BottomNavigationView,
) {
    fun updateSharedAppearance(tabsHost: TabsHost) {
        bottomNavigationView.isVisible = true
        bottomNavigationView.setBackgroundColor(
            tabsHost.tabBarBackgroundColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_surface_container),
        )

        val states =
            arrayOf(
                intArrayOf(-android.R.attr.state_checked),
                intArrayOf(android.R.attr.state_checked),
            )

        // Font color
        val fontInactiveColor =
            tabsHost.tabBarItemTitleFontColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_on_surface_variant)
        val fontActiveColor =
            tabsHost.tabBarItemTitleFontColorActive ?: tabsHost.tabBarItemTitleFontColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_secondary)
        val fontColors = intArrayOf(fontInactiveColor, fontActiveColor)
        bottomNavigationView.itemTextColor = ColorStateList(states, fontColors)

        // Icon color
        val iconInactiveColor =
            tabsHost.tabBarItemIconColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_on_surface_variant)
        val iconActiveColor =
            tabsHost.tabBarItemIconColorActive ?: tabsHost.tabBarItemIconColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_on_secondary_container)
        val iconColors = intArrayOf(iconInactiveColor, iconActiveColor)
        bottomNavigationView.itemIconTintList = ColorStateList(states, iconColors)

        // LabelVisibilityMode
        // From docs: can be one of LABEL_VISIBILITY_AUTO, LABEL_VISIBILITY_SELECTED, LABEL_VISIBILITY_LABELED, or LABEL_VISIBILITY_UNLABELED

        val visibilityMode =
            when (tabsHost.tabBarItemLabelVisibilityMode) {
                "selected" -> NavigationBarView.LABEL_VISIBILITY_SELECTED
                "labeled" -> NavigationBarView.LABEL_VISIBILITY_LABELED
                "unlabeled" -> NavigationBarView.LABEL_VISIBILITY_UNLABELED
                else -> NavigationBarView.LABEL_VISIBILITY_AUTO
            }

        bottomNavigationView.labelVisibilityMode = visibilityMode

        // Ripple color
        val rippleColor =
            tabsHost.tabBarItemRippleColor
                ?: context.getColor(com.google.android.material.R.color.m3_navigation_item_ripple_color)
        bottomNavigationView.itemRippleColor = ColorStateList.valueOf(rippleColor)

        // Active Indicator
        val activeIndicatorColor =
            tabsHost.tabBarItemActiveIndicatorColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_secondary_container)

        bottomNavigationView.isItemActiveIndicatorEnabled =
            tabsHost.isTabBarItemActiveIndicatorEnabled
        bottomNavigationView.itemActiveIndicatorColor = ColorStateList.valueOf(activeIndicatorColor)
    }

    fun updateFontStyles(tabsHost: TabsHost) {
        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        for (menuItem in bottomNavigationMenuView.children) {
            val largeLabel =
                menuItem.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_large_label_view)
            val smallLabel =
                menuItem.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_small_label_view)

            val isFontStyleItalic = tabsHost.tabBarItemTitleFontStyle == "italic"

            // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
            // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
            // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
            val fontWeight =
                if (tabsHost.tabBarItemTitleFontWeight ==
                    "bold"
                ) {
                    700
                } else {
                    tabsHost.tabBarItemTitleFontWeight?.toIntOrNull() ?: 400
                }

            val fontFamily =
                ReactFontManager.getInstance().getTypeface(
                    tabsHost.tabBarItemTitleFontFamily ?: "",
                    fontWeight,
                    isFontStyleItalic,
                    context.assets,
                )

            /*
                Short explanation about computations we're doing below.
                R.dimen, has defined value in SP, getDimension converts it to pixels, and by default
                TextView.setTextSize accepts SP, so the size is multiplied by density twice. Thus we need
                to convert both values to pixels and make sure that setTextSizes is about that.
                The Text tag in RN uses SP or DP based on `allowFontScaling` prop. For now we're going
                with SP, if there will be a need for skipping scale, the we should introduce similar
                `allowFontScaling` prop.
             */
            val smallFontSize =
                tabsHost.tabBarItemTitleFontSize?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
                    ?: context.resources.getDimension(com.google.android.material.R.dimen.design_bottom_navigation_text_size)
            val largeFontSize =
                tabsHost.tabBarItemTitleFontSizeActive?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
                    ?: context.resources.getDimension(com.google.android.material.R.dimen.design_bottom_navigation_text_size)

            // Inactive
            smallLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, smallFontSize)
            smallLabel.typeface = fontFamily

            // Active
            largeLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, largeFontSize)
            largeLabel.typeface = fontFamily
        }
    }

    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabScreen: TabScreen,
    ) {
        menuItem.title = tabScreen.tabTitle
        menuItem.icon = tabScreen.icon
    }

    fun updateBadgeAppearance(
        menuItem: MenuItem,
        tabScreen: TabScreen,
    ) {
        val menuItemIndex = bottomNavigationView.menu.children.indexOf(menuItem)
        val badgeValue = tabScreen.badgeValue

        if (badgeValue == null) {
            val badge = bottomNavigationView.getBadge(menuItemIndex)
            badge?.isVisible = false

            return
        }

        val badgeValueNumber = badgeValue.toIntOrNull()

        val badge = bottomNavigationView.getOrCreateBadge(menuItemIndex)
        badge.isVisible = true

        badge.clearText()
        badge.clearNumber()

        if (badgeValueNumber != null) {
            badge.number = badgeValueNumber
        } else if (badgeValue != "") {
            badge.text = badgeValue
        }

        // Styling
        badge.badgeTextColor =
            tabScreen.tabBarItemBadgeTextColor ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_on_error)
        badge.backgroundColor =
            tabScreen.tabBarItemBadgeBackgroundColor
                ?: context.getColor(com.google.android.material.R.color.m3_sys_color_light_error)
    }
}
