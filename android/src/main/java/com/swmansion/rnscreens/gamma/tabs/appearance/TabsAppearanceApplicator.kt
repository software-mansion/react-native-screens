package com.swmansion.rnscreens.gamma.tabs.appearance

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.StateListDrawable
import android.util.TypedValue
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.view.children
import androidx.core.view.isVisible
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.R
import com.google.android.material.badge.BadgeDrawable
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import com.swmansion.rnscreens.gamma.tabs.host.TabsHost
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.utils.resolveColorAttr

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
class TabsAppearanceApplicator(
    private val bottomNavigationView: BottomNavigationView,
) {
    private val states =
        arrayOf(
            intArrayOf(-android.R.attr.state_enabled), // disabled
            intArrayOf(android.R.attr.state_selected), // selected
            intArrayOf(android.R.attr.state_focused), // focused
            intArrayOf(), // normal
        )

    fun updateSharedAppearance(
        context: Context,
        tabsHost: TabsHost,
    ) {
        val tabBarAppearance = tabsHost.currentFocusedTab.tabsScreen.appearance

        updateTabBarVisibilityIfNeeded(tabsHost)
        updateTabBarBackgroundColorIfNeeded(context, tabBarAppearance)
        updateTabBarItemTitleFontColorsIfNeeded(context, tabBarAppearance)
        updateTabBarItemIconColorsIfNeeded(context, tabBarAppearance)
        updateTabBarItemLabelVisibilityModeIfNeeded(tabBarAppearance)
        updateTabBarItemRippleColorIfNeeded(context, tabBarAppearance)
        updateTabBarItemActiveIndicatorColorIfNeeded(context, tabBarAppearance)
        updateTabBarItemActiveIndicatorEnabledNeeded(tabBarAppearance)
    }

    fun updateFontStyles(
        context: Context,
        tabsHost: TabsHost,
    ) {
        val tabBarAppearance = tabsHost.currentFocusedTab.tabsScreen.appearance
        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        val targetSmallFontSize = resolveFontSize(context, tabBarAppearance?.tabBarItemTitleSmallLabelFontSize)
        val targetLargeFontSize = resolveFontSize(context, tabBarAppearance?.tabBarItemTitleLargeLabelFontSize)
        val targetTypeface = resolveTypeface(context, tabBarAppearance)

        for (menuItem in bottomNavigationMenuView.children) {
            // Inactive Tab
            updateTabBarItemLabelFontIfNeeded(menuItem, R.id.navigation_bar_item_small_label_view, targetSmallFontSize, targetTypeface)
            // Active Tab
            updateTabBarItemLabelFontIfNeeded(menuItem, R.id.navigation_bar_item_large_label_view, targetLargeFontSize, targetTypeface)
        }
    }

    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
    ) {
        updateMenuItemTitleIfNeeded(menuItem, tabsScreen.tabTitle)
        updateMenuItemIconIfNeeded(menuItem, tabsScreen)
    }

    internal fun updateBadgeAppearance(
        context: Context,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
    ) {
        val menuItemIndex = bottomNavigationView.menu.children.indexOf(menuItem)
        val badgeValue = tabsScreen.badgeValue

        if (badgeValue == null) {
            val badge = bottomNavigationView.getBadge(menuItemIndex)
            badge?.isVisible = false

            return
        }

        val badge = bottomNavigationView.getOrCreateBadge(menuItemIndex)
        if (!badge.isVisible) {
            badge.isVisible = true
        }

        updateBadgeValueIfNeeded(badge, badgeValue)
        updateBadgeColorsIfNeeded(context, badge, appearance)
    }

    // Mark: Props diffing

    private fun updateTabBarVisibilityIfNeeded(tabsHost: TabsHost) {
        val targetIsVisible = !tabsHost.tabBarHidden
        if (bottomNavigationView.isVisible != targetIsVisible) {
            bottomNavigationView.isVisible = targetIsVisible
        }
    }

    private fun updateTabBarBackgroundColorIfNeeded(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        val targetBgColor = appearance?.tabBarBackgroundColor ?: resolveColorAttr(context, R.attr.colorSurfaceContainer)
        val currentBgColor = (bottomNavigationView.background as? ColorDrawable)?.color
        if (currentBgColor != targetBgColor) {
            bottomNavigationView.setBackgroundColor(targetBgColor)
        }
    }

    private fun updateTabBarItemTitleFontColorsIfNeeded(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        // Defaults from spec: https://m3.material.io/components/navigation-bar/specs
        val targetFontColors =
            intArrayOf(
                appearance?.disabled?.tabBarItemTitleFontColor ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant),
                appearance?.selected?.tabBarItemTitleFontColor ?: resolveColorAttr(context, R.attr.colorOnSurface),
                appearance?.focused?.tabBarItemTitleFontColor ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant),
                appearance?.normal?.tabBarItemTitleFontColor ?: resolveColorAttr(context, R.attr.colorSecondary),
            )
        if (bottomNavigationView.itemTextColor?.matchesColors(targetFontColors) != true) {
            bottomNavigationView.itemTextColor = ColorStateList(states, targetFontColors)
        }
    }

    private fun updateTabBarItemIconColorsIfNeeded(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        val targetIconColors =
            intArrayOf(
                appearance?.disabled?.tabBarItemIconColor ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant),
                appearance?.selected?.tabBarItemIconColor ?: resolveColorAttr(context, R.attr.colorOnSecondaryContainer),
                appearance?.focused?.tabBarItemIconColor ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant),
                appearance?.normal?.tabBarItemIconColor ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant),
            )
        if (bottomNavigationView.itemIconTintList?.matchesColors(targetIconColors) != true) {
            bottomNavigationView.itemIconTintList = ColorStateList(states, targetIconColors)
        }
    }

    private fun updateTabBarItemLabelVisibilityModeIfNeeded(appearance: TabsAppearance?) {
        // From docs: can be one of LABEL_VISIBILITY_AUTO, LABEL_VISIBILITY_SELECTED, LABEL_VISIBILITY_LABELED, or LABEL_VISIBILITY_UNLABELED
        val targetVisibilityMode =
            when (appearance?.tabBarItemLabelVisibilityMode) {
                "selected" -> NavigationBarView.LABEL_VISIBILITY_SELECTED
                "labeled" -> NavigationBarView.LABEL_VISIBILITY_LABELED
                "unlabeled" -> NavigationBarView.LABEL_VISIBILITY_UNLABELED
                else -> NavigationBarView.LABEL_VISIBILITY_AUTO
            }
        if (bottomNavigationView.labelVisibilityMode != targetVisibilityMode) {
            bottomNavigationView.labelVisibilityMode = targetVisibilityMode
        }
    }

    private fun updateTabBarItemRippleColorIfNeeded(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        val targetRippleColor = appearance?.tabBarItemRippleColor ?: resolveColorAttr(context, R.attr.itemRippleColor)
        if (bottomNavigationView.itemRippleColor?.defaultColor != targetRippleColor) {
            bottomNavigationView.itemRippleColor = ColorStateList.valueOf(targetRippleColor)
        }
    }

    private fun updateTabBarItemActiveIndicatorColorIfNeeded(
        context: Context,
        appearance: TabsAppearance?,
    ) {
        val targetActiveIndicatorColor =
            appearance?.tabBarItemActiveIndicatorColor ?: resolveColorAttr(context, R.attr.colorSecondaryContainer)
        if (bottomNavigationView.itemActiveIndicatorColor?.defaultColor != targetActiveIndicatorColor) {
            bottomNavigationView.itemActiveIndicatorColor = ColorStateList.valueOf(targetActiveIndicatorColor)
        }
    }

    private fun updateTabBarItemActiveIndicatorEnabledNeeded(appearance: TabsAppearance?) {
        val targetActiveIndicatorEnabled = appearance?.tabBarItemActiveIndicatorEnabled ?: true
        if (bottomNavigationView.isItemActiveIndicatorEnabled != targetActiveIndicatorEnabled) {
            bottomNavigationView.isItemActiveIndicatorEnabled = targetActiveIndicatorEnabled
        }
    }

    private fun updateTabBarItemLabelFontIfNeeded(
        menuItemView: View,
        labelId: Int,
        fontSize: Float,
        typeface: Typeface,
    ) {
        val tabBarItemLabel = menuItemView.findViewById<TextView>(labelId)

        if (tabBarItemLabel.textSize != fontSize) {
            tabBarItemLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, fontSize)
        }
        if (tabBarItemLabel.typeface != typeface) {
            tabBarItemLabel.typeface = typeface
        }
    }

    private fun updateMenuItemTitleIfNeeded(
        menuItem: MenuItem,
        tabTitle: String?,
    ) {
        if (menuItem.title != tabTitle) {
            menuItem.title = tabTitle
        }
    }

    private fun updateMenuItemIconIfNeeded(
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
    ) {
        val targetIcon =
            if (tabsScreen.selectedIcon != null && tabsScreen.icon != null) {
                StateListDrawable().apply {
                    addState(intArrayOf(android.R.attr.state_checked), tabsScreen.selectedIcon?.mutate())
                    addState(intArrayOf(), tabsScreen.icon?.mutate())
                }
            } else {
                tabsScreen.icon
            }

        if (menuItem.icon != targetIcon) {
            menuItem.icon = targetIcon
        }
    }

    private fun updateBadgeValueIfNeeded(
        badge: BadgeDrawable,
        badgeValue: String,
    ) {
        val badgeValueNumber = badgeValue.toIntOrNull()
        if (badgeValueNumber != null) {
            if (badge.number != badgeValueNumber) {
                clearBadgeValue(badge)
                badge.number = badgeValueNumber
            }
        } else if (badgeValue != "") {
            if (badge.text != badgeValue) {
                clearBadgeValue(badge)
                badge.text = badgeValue
            }
        } else {
            clearBadgeValue(badge)
        }
    }

    private fun updateBadgeColorsIfNeeded(
        context: Context,
        badge: BadgeDrawable,
        appearance: TabsAppearance?,
    ) {
        val targetBadgeTextColor = appearance?.tabBarItemBadgeTextColor ?: resolveColorAttr(context, R.attr.colorOnError)
        if (badge.badgeTextColor != targetBadgeTextColor) {
            badge.badgeTextColor = targetBadgeTextColor
        }

        // https://github.com/material-components/material-components-android/blob/master/docs/getting-started.md#non-transitive-r-classes-referencing-library-resources-programmatically
        val targetBadgeBackgroundColor =
            appearance?.tabBarItemBadgeBackgroundColor ?: resolveColorAttr(context, androidx.appcompat.R.attr.colorError)
        if (badge.backgroundColor != targetBadgeBackgroundColor) {
            badge.backgroundColor = targetBadgeBackgroundColor
        }
    }

    // Mark: Helpers

    private fun ColorStateList.matchesColors(colors: IntArray): Boolean {
        // To correctly read the evaluated color, we must query it with proper state constructed
        val disabledQuery = intArrayOf()
        val selectedQuery = intArrayOf(android.R.attr.state_enabled, android.R.attr.state_selected)
        val focusedQuery = intArrayOf(android.R.attr.state_enabled, android.R.attr.state_focused)
        val normalQuery = intArrayOf(android.R.attr.state_enabled)

        return getColorForState(disabledQuery, 1) == colors[0] &&
            getColorForState(selectedQuery, 1) == colors[1] &&
            getColorForState(focusedQuery, 1) == colors[2] &&
            getColorForState(normalQuery, 1) == colors[3]
    }

    private fun resolveTypeface(
        context: Context,
        appearance: TabsAppearance?,
    ): Typeface {
        val isFontStyleItalic = appearance?.tabBarItemTitleFontStyle == "italic"
        // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
        // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
        // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
        val fontWeight =
            if (appearance?.tabBarItemTitleFontWeight ==
                "bold"
            ) {
                700
            } else {
                appearance?.tabBarItemTitleFontWeight?.toIntOrNull() ?: 400
            }

        val fontFamily =
            ReactFontManager.getInstance().getTypeface(
                appearance?.tabBarItemTitleFontFamily ?: "",
                fontWeight,
                isFontStyleItalic,
                context.assets,
            )
        return fontFamily
    }

    private fun resolveFontSize(
        context: Context,
        fontSp: Float?,
    ): Float {
        /*
            Short explanation about computations we're doing below.
            R.dimen, has defined value in SP, getDimension converts it to pixels, and by default
            TextView.setTextSize accepts SP, so the size is multiplied by density twice. Thus we need
            to convert both values to pixels and make sure that setTextSizes is about that.
            The Text tag in RN uses SP or DP based on `allowFontScaling` prop. For now we're going
            with SP, if there will be a need for skipping scale, the we should introduce similar
            `allowFontScaling` prop.
         */
        return fontSp?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
            ?: context.resources.getDimension(R.dimen.design_bottom_navigation_text_size)
    }

    private fun clearBadgeValue(badge: BadgeDrawable) {
        badge.clearText()
        badge.clearNumber()
    }

    companion object {
        const val TAG = "TabsAppearanceApplicator"
    }
}
