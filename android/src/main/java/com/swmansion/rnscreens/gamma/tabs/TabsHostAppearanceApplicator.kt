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

data class AndroidTabsAppearance(
    val backgroundColor: Int? = null,

    val itemColors: BottomNavItemColors? = null,

    val activeIndicator: ActiveIndicatorAppearance? = null,

    val itemRippleColor: Int? = null,
    val labelVisibilityMode: String? = null,

    val typography: TypographyAppearance? = null,
    val badge: BadgeAppearance? = null
)

data class BottomNavItemColors(
    val normal: ItemStateColors? = null,
    val selected: ItemStateColors? = null,
    val disabled: ItemStateColors? = null,
    val focused: ItemStateColors? = null
)

data class ItemStateColors(
    val iconColor: Int? = null,
    val titleColor: Int? = null
)

data class ActiveIndicatorAppearance(
    val enabled: Boolean? = null,
    val color: Int? = null
)

data class TypographyAppearance(
    val fontFamily: String? = null,
    val fontSize: Float? = null,
    val fontWeight: String? = null,
    val fontStyle: String? = null
)

data class BadgeAppearance(
    val textColor: Int? = null,
    val backgroundColor: Int? = null
)

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
class TabsHostAppearanceApplicator(
    private val context: ContextThemeWrapper,
    private val bottomNavigationView: BottomNavigationView,
) {
    private fun resolveColorAttr(attr: Int): Int {
        val typedValue = TypedValue()
        context.theme.resolveAttribute(attr, typedValue, true)
        return typedValue.data
    }

    fun updateSharedAppearance(tabsHost: TabsHost) {
        val tabBarAppearance = tabsHost.currentFocusedTab.tabScreen.appearance

        bottomNavigationView.isVisible = !tabsHost.tabBarHidden
        bottomNavigationView.setBackgroundColor(
            tabBarAppearance?.backgroundColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorSurfaceContainer),
        )

        val states =
            arrayOf(
                intArrayOf(-android.R.attr.state_enabled), // disabled
                intArrayOf(android.R.attr.state_focused), // focused
                intArrayOf(android.R.attr.state_selected), // selected
                intArrayOf(), // normal
            )

        // Font color
        val fontDisabledColor =
            tabBarAppearance?.itemColors?.disabled?.titleColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurface)

        val fontFocusedColor =
            tabBarAppearance?.itemColors?.focused?.titleColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurfaceVariant)

        val fontSelectedColor =
            tabBarAppearance?.itemColors?.selected?.titleColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurface)

        val fontNormalColor =
            tabBarAppearance?.itemColors?.normal?.titleColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurfaceVariant)

        val fontColors = intArrayOf(fontDisabledColor, fontFocusedColor, fontSelectedColor, fontNormalColor)
        bottomNavigationView.itemTextColor = ColorStateList(states, fontColors)

        // Icon color
        val iconDisabledColor =
            tabBarAppearance?.itemColors?.disabled?.iconColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurface)

        val iconFocusedColor =
            tabBarAppearance?.itemColors?.focused?.iconColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurfaceVariant)

        val iconSelectedColor =
            tabBarAppearance?.itemColors?.selected?.iconColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSecondaryContainer)

        val iconNormalColor =
            tabBarAppearance?.itemColors?.normal?.iconColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnSurfaceVariant)

        val iconColors = intArrayOf(iconDisabledColor, iconFocusedColor, iconSelectedColor, iconNormalColor)
        bottomNavigationView.itemIconTintList = ColorStateList(states, iconColors)

        // LabelVisibilityMode
        // From docs: can be one of LABEL_VISIBILITY_AUTO, LABEL_VISIBILITY_SELECTED, LABEL_VISIBILITY_LABELED, or LABEL_VISIBILITY_UNLABELED

        val visibilityMode =
            when (tabBarAppearance?.labelVisibilityMode) {
                "selected" -> NavigationBarView.LABEL_VISIBILITY_SELECTED
                "labeled" -> NavigationBarView.LABEL_VISIBILITY_LABELED
                "unlabeled" -> NavigationBarView.LABEL_VISIBILITY_UNLABELED
                else -> NavigationBarView.LABEL_VISIBILITY_AUTO
            }

        bottomNavigationView.labelVisibilityMode = visibilityMode

        // Ripple color
        val rippleColor =
            tabBarAppearance?.itemRippleColor
                ?: resolveColorAttr(com.google.android.material.R.attr.itemRippleColor)
        bottomNavigationView.itemRippleColor = ColorStateList.valueOf(rippleColor)

        // Active Indicator
        val activeIndicatorColor =
            tabBarAppearance?.activeIndicator?.color
                ?: resolveColorAttr(com.google.android.material.R.attr.colorSecondaryContainer)

        bottomNavigationView.isItemActiveIndicatorEnabled =
            tabBarAppearance?.activeIndicator?.enabled ?: true
        bottomNavigationView.itemActiveIndicatorColor = ColorStateList.valueOf(activeIndicatorColor)
    }

    fun updateFontStyles(tabsHost: TabsHost) {
        val tabBarAppearance = tabsHost.currentFocusedTab.tabScreen.appearance

        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        for (menuItem in bottomNavigationMenuView.children) {
            val largeLabel =
                menuItem.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_large_label_view)
            val smallLabel =
                menuItem.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_small_label_view)

            val isFontStyleItalic = tabBarAppearance?.typography?.fontStyle == "italic"

            // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
            // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
            // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
            val fontWeight =
                if (tabBarAppearance?.typography?.fontWeight ==
                    "bold"
                ) {
                    700
                } else {
                    tabBarAppearance?.typography?.fontWeight?.toIntOrNull() ?: 400
                }

            val fontFamily =
                ReactFontManager.getInstance().getTypeface(
                    tabBarAppearance?.typography?.fontFamily ?: "",
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
            // TODO: @t0maboro - should have activeFontSize
            val smallFontSize =
                tabBarAppearance?.typography?.fontSize?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
                    ?: context.resources.getDimension(com.google.android.material.R.dimen.design_bottom_navigation_text_size)
            val largeFontSize =
                tabBarAppearance?.typography?.fontSize?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
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
        if (menuItem.title != tabScreen.tabTitle) {
            menuItem.title = tabScreen.tabTitle
        }

        if (menuItem.icon != tabScreen.icon) {
            menuItem.icon = tabScreen.icon
        }
    }

    fun updateBadgeAppearance(
        menuItem: MenuItem,
        tabScreen: TabScreen,
        badgeAppearance: BadgeAppearance?
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
            badgeAppearance?.textColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnError)

        // https://github.com/material-components/material-components-android/blob/master/docs/getting-started.md#non-transitive-r-classes-referencing-library-resources-programmatically
        badge.backgroundColor =
            badgeAppearance?.backgroundColor
                ?: resolveColorAttr(androidx.appcompat.R.attr.colorError)
    }
}
