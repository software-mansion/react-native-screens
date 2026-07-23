package com.swmansion.rnscreens.gamma.tabs.appearance

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.graphics.drawable.InsetDrawable
import android.graphics.drawable.StateListDrawable
import android.util.TypedValue
import android.view.MenuItem
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.view.children
import androidx.core.view.isVisible
import com.facebook.react.common.assets.ReactFontManager
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.R
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import com.swmansion.rnscreens.gamma.tabs.screen.TabsScreen
import com.swmansion.rnscreens.utils.dpToPx
import com.swmansion.rnscreens.utils.pxToDp
import com.swmansion.rnscreens.utils.resolveColorAttr

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
internal class TabsAppearanceApplicator(
    private val bottomNavigationView: BottomNavigationView,
) {
    // Resolved on each access: tracks the material library version and the display density.
    private val defaultIconSizeDp: Float
        get() =
            bottomNavigationView.pxToDp(
                bottomNavigationView.resources.getDimension(R.dimen.mtrl_navigation_bar_item_default_icon_size),
            )

    internal fun effectiveIconSizeDp(tabsScreen: TabsScreen): Float =
        if (tabsScreen.drawableIconSize > 0f) tabsScreen.drawableIconSize else defaultIconSizeDp

    // Largest effective per-tab icon size (dp); Material allows only one size for all items.
    private var iconBoxDp: Float = defaultIconSizeDp

    fun applyIconBox(boxDp: Float?) {
        iconBoxDp = boxDp ?: defaultIconSizeDp
        bottomNavigationView.itemIconSize = bottomNavigationView.dpToPx(iconBoxDp).toInt()
    }

    // Theme-resolved defaults, captured at construction, before this class (the only writer) overrides them.
    private val defaultIndicatorWidthPx: Int = bottomNavigationView.itemActiveIndicatorWidth
    private val defaultIndicatorHeightPx: Int = bottomNavigationView.itemActiveIndicatorHeight

    // Auto-scale preserves the themed default padding around the icon: default indicator minus default icon size.
    private val autoIndicatorHorizontalPaddingDp: Float
        get() = bottomNavigationView.pxToDp(defaultIndicatorWidthPx.toFloat()) - defaultIconSizeDp

    private val autoIndicatorVerticalPaddingDp: Float
        get() = bottomNavigationView.pxToDp(defaultIndicatorHeightPx.toFloat()) - defaultIconSizeDp

    // Reads iconBoxDp, so applyIconBox must run first.
    private fun applyActiveIndicatorSize(
        widthDp: Float?,
        heightDp: Float?,
    ) {
        bottomNavigationView.itemActiveIndicatorWidth =
            resolveIndicatorDimensionPx(widthDp, iconBoxDp + autoIndicatorHorizontalPaddingDp, defaultIndicatorWidthPx)
        bottomNavigationView.itemActiveIndicatorHeight =
            resolveIndicatorDimensionPx(heightDp, iconBoxDp + autoIndicatorVerticalPaddingDp, defaultIndicatorHeightPx)
    }

    // Explicit dp wins; else auto-scale to the enlarged icon box; else themed Material default.
    private fun resolveIndicatorDimensionPx(
        explicitDp: Float?,
        autoScaledDp: Float,
        defaultPx: Int,
    ): Int =
        when {
            explicitDp != null && explicitDp > 0f -> bottomNavigationView.dpToPx(explicitDp).toInt()
            iconBoxDp > defaultIconSizeDp -> bottomNavigationView.dpToPx(autoScaledDp).toInt()
            else -> defaultPx
        }

    // Inset the icon so it renders at effectiveDp, centered within iconBoxDp.
    // Intrinsic-relative on purpose: Material FIT_CENTER-scales the drawable to the icon box,
    // so the intrinsic factor cancels and the glyph lands at effectiveDp/iconBoxDp of the box.
    private fun sizeIcon(
        icon: Drawable?,
        effectiveDp: Float,
    ): Drawable? {
        if (icon == null || effectiveDp >= iconBoxDp) return icon
        val larger = maxOf(icon.intrinsicWidth, icon.intrinsicHeight)
        if (larger <= 0) return icon
        val insetPx = (larger * (iconBoxDp - effectiveDp) / (2f * effectiveDp)).toInt()
        return if (insetPx > 0) InsetDrawable(icon, insetPx) else icon
    }

    private val states =
        arrayOf(
            intArrayOf(-android.R.attr.state_enabled), // disabled
            intArrayOf(android.R.attr.state_selected), // selected
            intArrayOf(android.R.attr.state_focused), // focused
            intArrayOf(), // normal
        )

    fun updateSharedAppearance(
        context: Context,
        tabBarAppearance: TabsAppearance?,
        isTabBarHidden: Boolean,
    ) {
        bottomNavigationView.isVisible = !isTabBarHidden
        bottomNavigationView.setBackgroundColor(
            tabBarAppearance?.tabBarBackgroundColor
                ?: resolveColorAttr(context, R.attr.colorSurfaceContainer),
        )

        // Font color
        // Defaults from spec: https://m3.material.io/components/navigation-bar/specs
        val fontDisabledColor =
            tabBarAppearance?.disabled?.tabBarItemTitleFontColor
                ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant)

        val fontFocusedColor =
            tabBarAppearance?.focused?.tabBarItemTitleFontColor
                ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant)

        val fontSelectedColor =
            tabBarAppearance?.selected?.tabBarItemTitleFontColor
                ?: resolveColorAttr(context, R.attr.colorOnSurface)

        val fontNormalColor =
            tabBarAppearance?.normal?.tabBarItemTitleFontColor
                ?: resolveColorAttr(context, R.attr.colorSecondary)

        val fontColors = intArrayOf(fontDisabledColor, fontSelectedColor, fontFocusedColor, fontNormalColor)
        bottomNavigationView.itemTextColor = ColorStateList(states, fontColors)

        // Icon color
        val iconDisabledColor =
            tabBarAppearance?.disabled?.tabBarItemIconColor
                ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant)

        val iconFocusedColor =
            tabBarAppearance?.focused?.tabBarItemIconColor
                ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant)

        val iconSelectedColor =
            tabBarAppearance?.selected?.tabBarItemIconColor
                ?: resolveColorAttr(context, R.attr.colorOnSecondaryContainer)

        val iconNormalColor =
            tabBarAppearance?.normal?.tabBarItemIconColor
                ?: resolveColorAttr(context, R.attr.colorOnSurfaceVariant)

        val iconColors = intArrayOf(iconDisabledColor, iconSelectedColor, iconFocusedColor, iconNormalColor)
        bottomNavigationView.itemIconTintList = ColorStateList(states, iconColors)

        // LabelVisibilityMode
        // From docs: can be one of LABEL_VISIBILITY_AUTO, LABEL_VISIBILITY_SELECTED, LABEL_VISIBILITY_LABELED, or LABEL_VISIBILITY_UNLABELED

        val visibilityMode =
            when (tabBarAppearance?.tabBarItemLabelVisibilityMode) {
                "selected" -> NavigationBarView.LABEL_VISIBILITY_SELECTED
                "labeled" -> NavigationBarView.LABEL_VISIBILITY_LABELED
                "unlabeled" -> NavigationBarView.LABEL_VISIBILITY_UNLABELED
                else -> NavigationBarView.LABEL_VISIBILITY_AUTO
            }

        bottomNavigationView.labelVisibilityMode = visibilityMode

        // Ripple color
        val rippleColor =
            tabBarAppearance?.tabBarItemRippleColor
                ?: resolveColorAttr(context, R.attr.itemRippleColor)
        bottomNavigationView.itemRippleColor = ColorStateList.valueOf(rippleColor)

        // Active Indicator
        val activeIndicatorColor =
            tabBarAppearance?.tabBarItemActiveIndicatorColor
                ?: resolveColorAttr(context, R.attr.colorSecondaryContainer)

        bottomNavigationView.isItemActiveIndicatorEnabled =
            tabBarAppearance?.tabBarItemActiveIndicatorEnabled ?: true
        bottomNavigationView.itemActiveIndicatorColor = ColorStateList.valueOf(activeIndicatorColor)

        applyActiveIndicatorSize(
            tabBarAppearance?.tabBarItemActiveIndicatorWidth,
            tabBarAppearance?.tabBarItemActiveIndicatorHeight,
        )
    }

    fun updateFontStyles(
        context: Context,
        tabBarAppearance: TabsAppearance?,
    ) {
        val bottomNavigationMenuView = bottomNavigationView.getChildAt(0) as ViewGroup

        for (menuItem in bottomNavigationMenuView.children) {
            val largeLabel =
                menuItem.findViewById<TextView>(R.id.navigation_bar_item_large_label_view)
            val smallLabel =
                menuItem.findViewById<TextView>(R.id.navigation_bar_item_small_label_view)

            val isFontStyleItalic = tabBarAppearance?.tabBarItemTitleFontStyle == "italic"

            // Bold is 700, normal is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L150
            // It can be any other int -> https://reactnative.dev/docs/text-style-props#fontweight
            // Default is 400 -> https://github.com/facebook/react-native/blob/e0efd3eb5b637bd00fb7528ab4d129f6b3e13d03/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/common/assets/ReactFontManager.kt#L117
            val fontWeight =
                if (tabBarAppearance?.tabBarItemTitleFontWeight ==
                    "bold"
                ) {
                    700
                } else {
                    tabBarAppearance?.tabBarItemTitleFontWeight?.toIntOrNull() ?: 400
                }

            val fontFamily =
                ReactFontManager.getInstance().getTypeface(
                    tabBarAppearance?.tabBarItemTitleFontFamily ?: "",
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
                tabBarAppearance?.tabBarItemTitleSmallLabelFontSize?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
                    ?: context.resources.getDimension(R.dimen.design_bottom_navigation_text_size)
            val largeFontSize =
                tabBarAppearance?.tabBarItemTitleLargeLabelFontSize?.takeIf { it > 0 }?.let { PixelUtil.toPixelFromSP(it) }
                    ?: context.resources.getDimension(R.dimen.design_bottom_navigation_text_size)

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
        tabsScreen: TabsScreen,
    ) {
        if (menuItem.title != tabsScreen.tabTitle) {
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

        val sizedIcon = sizeIcon(targetIcon, effectiveIconSizeDp(tabsScreen))

        if (menuItem.icon != sizedIcon) {
            menuItem.icon = sizedIcon
        }
    }

    internal fun updateBadgeAppearance(
        context: Context,
        menuItem: MenuItem,
        tabsScreen: TabsScreen,
        appearance: TabsAppearance?,
    ) {
        val menuItemId = menuItem.itemId
        val badgeValue = tabsScreen.badgeValue

        if (badgeValue == null) {
            val badge = bottomNavigationView.getBadge(menuItemId)
            badge?.isVisible = false

            return
        }

        val badgeValueNumber = badgeValue.toIntOrNull()

        val badge = bottomNavigationView.getOrCreateBadge(menuItemId)
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
            appearance?.tabBarItemBadgeTextColor
                ?: resolveColorAttr(context, R.attr.colorOnError)

        // https://github.com/material-components/material-components-android/blob/master/docs/getting-started.md#non-transitive-r-classes-referencing-library-resources-programmatically
        badge.backgroundColor =
            appearance?.tabBarItemBadgeBackgroundColor
                ?: resolveColorAttr(context, androidx.appcompat.R.attr.colorError)
    }

    companion object {
        const val TAG = "TabsAppearanceApplicator"
    }
}
