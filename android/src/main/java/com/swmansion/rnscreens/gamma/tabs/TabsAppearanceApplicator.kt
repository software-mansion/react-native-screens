package com.swmansion.rnscreens.gamma.tabs.host

import android.annotation.SuppressLint
import android.content.res.ColorStateList
import android.graphics.drawable.StateListDrawable
import android.util.TypedValue
import android.view.MenuItem
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.view.children
import androidx.core.view.isVisible
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.R
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
class TabsAppearanceApplicator(
    private val context: ContextThemeWrapper,
    private val bottomNavigationView: BottomNavigationView,
) {
    private var lastBackgroundColor: Int? = null
    private var lastFontColors: IntArray? = null
    private var lastIconColors: IntArray? = null
    private var lastLabelVisibilityMode: Int? = null
    private var lastRippleColor: Int? = null
    private var lastActiveIndicatorColor: Int? = null
    private var lastIsActiveIndicatorEnabled: Boolean? = null

    private val lastBadgeValues = mutableMapOf<Int, String?>()
    private val lastBadgeTextColors = mutableMapOf<Int, Int>()
    private val lastBadgeBackgroundColors = mutableMapOf<Int, Int>()

    private val states =
        arrayOf(
            intArrayOf(-android.R.attr.state_enabled), // disabled
            intArrayOf(android.R.attr.state_selected), // selected
            intArrayOf(android.R.attr.state_focused), // focused
            intArrayOf(), // normal
        )

    private inline fun <T> updatePropIfChanged(
        oldValue: T,
        newValue: T,
        updateFn: (T) -> Unit,
    ): T {
        if (oldValue != newValue) {
            updateFn(newValue)
        }
        return newValue
    }

    private inline fun updatePropsIfArrayChanged(
        oldValue: IntArray?,
        newValue: IntArray,
        updateFn: (IntArray) -> Unit,
    ): IntArray {
        if (oldValue == null || !oldValue.contentEquals(newValue)) {
            updateFn(newValue)
        }
        return newValue
    }

    private fun resolveColorAttr(attr: Int): Int {
        val typedValue = TypedValue()
        context.theme.resolveAttribute(attr, typedValue, true)
        return typedValue.data
    }

    fun updateSharedAppearance(tabsHost: TabsHost) {
        val tabBarAppearance = tabsHost.currentFocusedTab.tabScreen.appearance

        updatePropIfChanged(bottomNavigationView.isVisible, !tabsHost.tabBarHidden) {
            bottomNavigationView.isVisible = !tabsHost.tabBarHidden
        }

        val newBackgroundColor =
            tabBarAppearance?.backgroundColor
                ?: resolveColorAttr(R.attr.colorSurfaceContainer)
        lastBackgroundColor =
            updatePropIfChanged(lastBackgroundColor, newBackgroundColor) {
                bottomNavigationView.setBackgroundColor(newBackgroundColor)
            }

        // Font color
        // Defaults from spec: https://m3.material.io/components/navigation-bar/specs
        val fontDisabledColor =
            tabBarAppearance?.itemColors?.disabled?.titleColor
                ?: resolveColorAttr(R.attr.colorOnSurfaceVariant)

        val fontFocusedColor =
            tabBarAppearance?.itemColors?.focused?.titleColor
                ?: resolveColorAttr(R.attr.colorOnSurfaceVariant)

        val fontSelectedColor =
            tabBarAppearance?.itemColors?.selected?.titleColor
                ?: resolveColorAttr(R.attr.colorOnSurface)

        val fontNormalColor =
            tabBarAppearance?.itemColors?.normal?.titleColor
                ?: resolveColorAttr(R.attr.colorSecondary)

        val newFontColors = intArrayOf(fontDisabledColor, fontSelectedColor, fontFocusedColor, fontNormalColor)
        lastFontColors =
            updatePropsIfArrayChanged(lastFontColors, newFontColors) {
                bottomNavigationView.itemTextColor = ColorStateList(states, newFontColors)
            }

        // Icon color
        // Defaults from spec: https://m3.material.io/components/navigation-bar/specs
        val iconDisabledColor =
            tabBarAppearance?.itemColors?.disabled?.iconColor
                ?: resolveColorAttr(R.attr.colorOnSurfaceVariant)

        val iconFocusedColor =
            tabBarAppearance?.itemColors?.focused?.iconColor
                ?: resolveColorAttr(R.attr.colorOnSurfaceVariant)

        val iconSelectedColor =
            tabBarAppearance?.itemColors?.selected?.iconColor
                ?: resolveColorAttr(R.attr.colorOnSecondaryContainer)

        val iconNormalColor =
            tabBarAppearance?.itemColors?.normal?.iconColor
                ?: resolveColorAttr(R.attr.colorOnSurfaceVariant)

        val newIconColors = intArrayOf(iconDisabledColor, iconSelectedColor, iconFocusedColor, iconNormalColor)
        lastIconColors =
            updatePropsIfArrayChanged(lastIconColors, newIconColors) {
                bottomNavigationView.itemIconTintList = ColorStateList(states, newIconColors)
            }

        // LabelVisibilityMode
        // From docs: can be one of LABEL_VISIBILITY_AUTO, LABEL_VISIBILITY_SELECTED, LABEL_VISIBILITY_LABELED, or LABEL_VISIBILITY_UNLABELED

        val newVisibilityMode =
            when (tabBarAppearance?.labelVisibilityMode) {
                "selected" -> NavigationBarView.LABEL_VISIBILITY_SELECTED
                "labeled" -> NavigationBarView.LABEL_VISIBILITY_LABELED
                "unlabeled" -> NavigationBarView.LABEL_VISIBILITY_UNLABELED
                else -> NavigationBarView.LABEL_VISIBILITY_AUTO
            }
        lastLabelVisibilityMode =
            updatePropIfChanged(lastLabelVisibilityMode, newVisibilityMode) {
                bottomNavigationView.labelVisibilityMode = newVisibilityMode
            }

        // Ripple color
        val newRippleColor =
            tabBarAppearance?.itemRippleColor
                ?: resolveColorAttr(R.attr.itemRippleColor)
        lastRippleColor =
            updatePropIfChanged(lastRippleColor, newRippleColor) {
                bottomNavigationView.itemRippleColor = ColorStateList.valueOf(newRippleColor)
            }

        // Active Indicator
        val newActiveIndicatorColor =
            tabBarAppearance?.activeIndicator?.color
                ?: resolveColorAttr(R.attr.colorSecondaryContainer)
        lastActiveIndicatorColor =
            updatePropIfChanged(lastActiveIndicatorColor, newActiveIndicatorColor) {
                bottomNavigationView.itemActiveIndicatorColor = ColorStateList.valueOf(newActiveIndicatorColor)
            }

        val newIsActiveIndicatorEnabled = tabBarAppearance?.activeIndicator?.enabled ?: true
        lastIsActiveIndicatorEnabled =
            updatePropIfChanged(lastIsActiveIndicatorEnabled, newIsActiveIndicatorEnabled) {
                bottomNavigationView.isItemActiveIndicatorEnabled = newIsActiveIndicatorEnabled
            }
    }

    fun updateFontStyles(tabsHost: TabsHost) {
        val tabBarAppearance = tabsHost.currentFocusedTab.tabScreen.appearance

        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        val newIsFontStyleItalic = tabBarAppearance?.typography?.fontStyle == "italic"

        // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
        // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
        // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
        val newFontWeight =
            if (tabBarAppearance?.typography?.fontWeight ==
                "bold"
            ) {
                700
            } else {
                tabBarAppearance?.typography?.fontWeight?.toIntOrNull() ?: 400
            }

        val newFontFamily =
            ReactFontManager.getInstance().getTypeface(
                tabBarAppearance?.typography?.fontFamily ?: "",
                newFontWeight,
                newIsFontStyleItalic,
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
        val newSmallFontSize =
            tabBarAppearance
                ?.typography
                ?.fontSizeSmall
                ?.takeIf { it > 0 }
                ?.let { PixelUtil.toPixelFromSP(it) }
                ?: context.resources.getDimension(com.google.android.material.R.dimen.design_bottom_navigation_text_size)
        val newLargeFontSize =
            tabBarAppearance
                ?.typography
                ?.fontSizeLarge
                ?.takeIf { it > 0 }
                ?.let { PixelUtil.toPixelFromSP(it) }
                ?: context.resources.getDimension(com.google.android.material.R.dimen.design_bottom_navigation_text_size)

        for (menuItem in bottomNavigationMenuView.children) {
            val largeLabel =
                menuItem.findViewById<TextView>(R.id.navigation_bar_item_large_label_view)
            val smallLabel =
                menuItem.findViewById<TextView>(R.id.navigation_bar_item_small_label_view)

            // Inactive
            updatePropIfChanged(smallLabel.textSize, newSmallFontSize) {
                smallLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, newSmallFontSize)
            }
            updatePropIfChanged(smallLabel.typeface, newFontFamily) {
                smallLabel.typeface = newFontFamily
            }

            // Active
            updatePropIfChanged(largeLabel.textSize, newLargeFontSize) {
                largeLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, newLargeFontSize)
            }
            updatePropIfChanged(largeLabel.typeface, newFontFamily) {
                largeLabel.typeface = newFontFamily
            }
        }
    }

    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
    ) {
        updatePropIfChanged(menuItem.title, tabsScreen.tabTitle) {
            menuItem.title = tabsScreen.tabTitle
        }

        val targetIcon =
            if (tabsScreen.selectedIcon != null && tabsScreen.icon != null) {
                StateListDrawable().apply {
                    addState(intArrayOf(android.R.attr.state_checked), tabsScreen.selectedIcon?.mutate())
                    addState(intArrayOf(), tabsScreen.icon?.mutate())
                }
            } else {
                tabsScreen.icon
            }

        updatePropIfChanged(menuItem.icon, targetIcon) {
            menuItem.icon = targetIcon
        }
    }

    internal fun updateBadgeAppearance(
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        badgeAppearance: BadgeAppearance?,
    ) {
        val menuItemIndex = bottomNavigationView.menu.children.indexOf(menuItem)
        val badgeValue = tabsScreen.badgeValue

        if (badgeValue == null) {
            if (lastBadgeValues[menuItemIndex] != null || !lastBadgeValues.containsKey(menuItemIndex)) {
                lastBadgeValues[menuItemIndex] = null
            }

            val badge = bottomNavigationView.getBadge(menuItemIndex)
            badge?.isVisible = false

            return
        }

        val badge = bottomNavigationView.getOrCreateBadge(menuItemIndex)
        badge.isVisible = true

        lastBadgeValues[menuItemIndex] =
            updatePropIfChanged(lastBadgeValues[menuItemIndex], badgeValue) { newValue ->
                val badgeValueNumber = newValue?.toIntOrNull()

                badge.clearText()
                badge.clearNumber()

                if (badgeValueNumber != null) {
                    badge.number = badgeValueNumber
                } else if (newValue != "") {
                    badge.text = newValue
                }
            }

        // Styling
        val oldBadgeTextColor: Int =
            lastBadgeTextColors[menuItemIndex]
                ?: resolveColorAttr(com.google.android.material.R.attr.colorOnError)
        val newBadgeTextColor =
            badgeAppearance?.textColor
                ?: resolveColorAttr(R.attr.colorOnError)
        lastBadgeTextColors[menuItemIndex] =
            updatePropIfChanged(oldBadgeTextColor, newBadgeTextColor) {
                badge.badgeTextColor = newBadgeTextColor
            }

        // https://github.com/material-components/material-components-android/blob/master/docs/getting-started.md#non-transitive-r-classes-referencing-library-resources-programmatically
        val oldBadgeBackgroundColor: Int =
            lastBadgeBackgroundColors[menuItemIndex]
                ?: resolveColorAttr(androidx.appcompat.R.attr.colorError)
        val newBadgeBackgroundColor =
            badgeAppearance?.backgroundColor
                ?: resolveColorAttr(androidx.appcompat.R.attr.colorError)
        lastBadgeBackgroundColors[menuItemIndex] =
            updatePropIfChanged(oldBadgeBackgroundColor, newBadgeBackgroundColor) {
                badge.backgroundColor = newBadgeBackgroundColor
            }
    }
}
