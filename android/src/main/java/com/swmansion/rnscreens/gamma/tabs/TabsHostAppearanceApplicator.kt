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
import com.google.android.material.badge.BadgeDrawable
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView

// TODO: @t0maboro - extract it to a separate file
data class AndroidTabsAppearance(
    val normal: AndroidTabsScreenItemStateAppearance? = null,
    val selected: AndroidTabsScreenItemStateAppearance? = null,
    val focused: AndroidTabsScreenItemStateAppearance? = null,
    val disabled: AndroidTabsScreenItemStateAppearance? = null,
    val tabBarBackgroundColor: Int? = null,
    val tabBarItemRippleColor: Int? = null,
    val tabBarItemActiveIndicatorColor: Int? = null,
    val tabBarItemActiveIndicatorEnabled: Boolean? = null,
    val tabBarItemLabelVisibilityMode: String? = null,
)

data class AndroidTabsScreenItemStateAppearance(
    val tabBarItemTitleFontFamily: String? = null,
    val tabBarItemTitleFontSize: Float? = null,
    val tabBarItemTitleFontWeight: String? = null,
    val tabBarItemTitleFontStyle: String? = null,
    val tabBarItemTitleFontColor: Int? = null,
    val tabBarItemIconColor: Int? = null,
    val tabBarItemBadgeTextColor: Int? = null,
    val tabBarItemBadgeBackgroundColor: Int? = null,
)

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
class TabsHostAppearanceApplicator(
    private val context: ContextThemeWrapper,
    private val bottomNavigationView: BottomNavigationView,
) {
    private fun resolveColor(
        color: Int?,
        attr: Int,
    ): Int {
        if (color != null) return color

        val typedValue = TypedValue()
        context.theme.resolveAttribute(attr, typedValue, true)
        return typedValue.data
    }

    private fun resolveColorAttr(attr: Int): Int = resolveColor(null, attr)

    fun updateSharedAppearance(
        tabsHost: TabsHost,
        activeTabScreen: TabScreen?,
    ) {
        val appearance = activeTabScreen?.appearance

        bottomNavigationView.isVisible = !tabsHost.tabBarHidden
        bottomNavigationView.setBackgroundColor(
            appearance?.tabBarBackgroundColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorSurfaceContainer),
        )

        val states =
            arrayOf(
                intArrayOf(-android.R.attr.state_enabled), // disabled
                intArrayOf(android.R.attr.state_focused), // focused
                intArrayOf(android.R.attr.state_checked), // selected
                intArrayOf(), // normal
            )

        // Font color
        val fontDisabledColor =
            resolveColor(
                appearance?.disabled?.tabBarItemTitleFontColor,
                com.google.android.material.R.attr.colorOnSurfaceVariant,
            )

        val fontFocusedColor =
            resolveColor(
                appearance?.focused?.tabBarItemTitleFontColor,
                com.google.android.material.R.attr.colorOnSurface,
            )

        val fontSelectedColor =
            resolveColor(
                appearance?.selected?.tabBarItemTitleFontColor,
                com.google.android.material.R.attr.colorSecondary,
            )

        val fontNormalColor =
            resolveColor(
                appearance?.normal?.tabBarItemTitleFontColor,
                com.google.android.material.R.attr.colorOnSurfaceVariant,
            )

        val fontColors = intArrayOf(fontDisabledColor, fontFocusedColor, fontSelectedColor, fontNormalColor)
        bottomNavigationView.itemTextColor = ColorStateList(states, fontColors)

        // Icon color
        val iconDisabledColor =
            resolveColor(
                appearance?.disabled?.tabBarItemIconColor,
                com.google.android.material.R.attr.colorOnSurfaceVariant,
            )

        val iconFocusedColor =
            resolveColor(
                appearance?.focused?.tabBarItemIconColor,
                com.google.android.material.R.attr.colorOnSecondaryContainer,
            )

        val iconSelectedColor =
            resolveColor(
                appearance?.selected?.tabBarItemIconColor,
                com.google.android.material.R.attr.colorOnSecondaryContainer,
            )

        val iconNormalColor =
            resolveColor(
                appearance?.normal?.tabBarItemIconColor,
                com.google.android.material.R.attr.colorOnSurfaceVariant,
            )

        val iconColors = intArrayOf(iconDisabledColor, iconFocusedColor, iconSelectedColor, iconNormalColor)
        bottomNavigationView.itemIconTintList = ColorStateList(states, iconColors)

        // LabelVisibilityMode
        // From docs: can be one of LABEL_VISIBILITY_AUTO, LABEL_VISIBILITY_SELECTED, LABEL_VISIBILITY_LABELED, or LABEL_VISIBILITY_UNLABELED

        val visibilityMode =
            when (appearance?.tabBarItemLabelVisibilityMode) {
                "selected" -> NavigationBarView.LABEL_VISIBILITY_SELECTED
                "labeled" -> NavigationBarView.LABEL_VISIBILITY_LABELED
                "unlabeled" -> NavigationBarView.LABEL_VISIBILITY_UNLABELED
                else -> NavigationBarView.LABEL_VISIBILITY_AUTO
            }

        bottomNavigationView.labelVisibilityMode = visibilityMode

        // Ripple color
        val rippleColor =
            appearance?.tabBarItemRippleColor
                ?: resolveColorAttr(com.google.android.material.R.attr.itemRippleColor)
        bottomNavigationView.itemRippleColor = ColorStateList.valueOf(rippleColor)

        // Active Indicator
        val activeIndicatorColor =
            appearance?.tabBarItemActiveIndicatorColor
                ?: resolveColorAttr(com.google.android.material.R.attr.colorSecondaryContainer)

        bottomNavigationView.isItemActiveIndicatorEnabled =
            appearance?.tabBarItemActiveIndicatorEnabled ?: true
        bottomNavigationView.itemActiveIndicatorColor = ColorStateList.valueOf(activeIndicatorColor)
    }

    fun updateFontStyles(
        tabsHost: TabsHost,
        activeTabScreen: TabScreen?,
    ) {
        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        // activeTabScreen determines font styles for the entire tabBar
        val appearance = activeTabScreen?.appearance

        for (i in 0 until bottomNavigationMenuView.childCount) {
            val itemView = bottomNavigationMenuView.getChildAt(i)
            val menuItem = bottomNavigationView.menu.getItem(i)

            val isSelected = menuItem.isChecked
            val isEnabled = menuItem.isEnabled
            val isFocused = itemView.isFocused

            val stateAppearance = when {
                !isEnabled -> appearance?.disabled
                isFocused -> appearance?.focused
                isSelected -> appearance?.selected
                else -> appearance?.normal
            }
            
            // TODO: @t0maboro - fallback should be material object with defaults
            val fallback = appearance?.normal

            val fontStyle = stateAppearance?.tabBarItemTitleFontStyle ?: fallback?.tabBarItemTitleFontStyle
            val isFontStyleItalic = fontStyle == "italic"

            // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
            // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
            // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
            val fontWeightRaw = stateAppearance?.tabBarItemTitleFontWeight ?: fallback?.tabBarItemTitleFontWeight
            val fontWeight = if (fontWeightRaw == "bold") {
                700
            } else {
                fontWeightRaw?.toIntOrNull() ?: 400
            }

            val fontFamilyName = stateAppearance?.tabBarItemTitleFontFamily ?: fallback?.tabBarItemTitleFontFamily ?: ""

            val typeface = ReactFontManager.getInstance().getTypeface(
                fontFamilyName,
                fontWeight,
                isFontStyleItalic,
                context.assets
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
            val fontSizeSp = stateAppearance?.tabBarItemTitleFontSize ?: fallback?.tabBarItemTitleFontSize
            val fontSizePx = fontSizeSp?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
                ?: context.resources.getDimension(com.google.android.material.R.dimen.design_bottom_navigation_text_size)

            if (isSelected) {
                val largeLabel = itemView.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_large_label_view)
                largeLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, fontSizePx)
                largeLabel.typeface = typeface
            } else {
                val smallLabel = itemView.findViewById<TextView>(com.google.android.material.R.id.navigation_bar_item_small_label_view)
                smallLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, fontSizePx)
                smallLabel.typeface = typeface
            }
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
        activeTabScreen: TabScreen,
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

        val menuView = bottomNavigationView.getChildAt(0) as ViewGroup
        val itemView = menuView.getChildAt(menuItemIndex)

        updateBadgeStyle(badge, itemView.isFocused, tabScreen, activeTabScreen, menuItem)
    }

    fun updateBadgeStyle(
        badge: BadgeDrawable,
        isFocused: Boolean,
        tabScreen: TabScreen,
        activeTabScreen: TabScreen,
        menuItem: MenuItem,
    ) {
        val isSelected = tabScreen == activeTabScreen
        val isEnabled = menuItem.isEnabled
        val appearance = activeTabScreen.appearance

        fun resolveStateColor(
            disabledColor: Int?,
            focusedColor: Int?,
            selectedColor: Int?,
            normalColor: Int?,
            defaultAttr: Int,
        ): Int {
            val colorRaw =
                when {
                    !isEnabled -> disabledColor
                    isFocused -> focusedColor
                    isSelected -> selectedColor
                    else -> normalColor
                }
            return colorRaw ?: resolveColorAttr(defaultAttr)
        }

        badge.badgeTextColor =
            resolveStateColor(
                disabledColor = appearance?.disabled?.tabBarItemBadgeTextColor,
                focusedColor = appearance?.focused?.tabBarItemBadgeTextColor,
                selectedColor = appearance?.selected?.tabBarItemBadgeTextColor,
                normalColor = appearance?.normal?.tabBarItemBadgeTextColor,
                defaultAttr = com.google.android.material.R.attr.colorOnError,
            )

        // https://github.com/material-components/material-components-android/blob/master/docs/getting-started.md#non-transitive-r-classes-referencing-library-resources-programmatically
        badge.backgroundColor =
            resolveStateColor(
                disabledColor = appearance?.disabled?.tabBarItemBadgeBackgroundColor,
                focusedColor = appearance?.focused?.tabBarItemBadgeBackgroundColor,
                selectedColor = appearance?.selected?.tabBarItemBadgeBackgroundColor,
                normalColor = appearance?.normal?.tabBarItemBadgeBackgroundColor,
                defaultAttr = androidx.appcompat.R.attr.colorError,
            )
    }
}
