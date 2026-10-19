package com.swmansion.rnscreens.core.containers.tabs.appearance

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
import com.google.android.material.R
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarItemView
import com.google.android.material.navigation.NavigationBarView
import com.swmansion.rnscreens.core.common.text.FontResolver
import com.swmansion.rnscreens.core.containers.tabs.container.TabsMenuItemState
import com.swmansion.rnscreens.core.containers.tabs.item.TabsContainerItem
import com.swmansion.rnscreens.core.containers.tabs.item.TabsItemInvalidationFlags
import com.swmansion.rnscreens.core.utils.dpToPx
import com.swmansion.rnscreens.core.utils.pxToDp
import com.swmansion.rnscreens.core.utils.resolveColorAttr

@SuppressLint("PrivateResource") // We want to use variables from material design for default values
internal class TabsAppearanceApplicator(
    private val bottomNavigationView: BottomNavigationView,
    private val titleFontResolver: FontResolver,
) {
    // Resolved on each access: tracks the display density of the current configuration.
    internal val defaultIconSizeDp: Float
        get() =
            bottomNavigationView.pxToDp(
                bottomNavigationView.resources.getDimension(R.dimen.mtrl_navigation_bar_item_default_icon_size),
            )

    internal fun effectiveIconSizeDp(item: TabsContainerItem): Float =
        item.appearance?.tabBarItemIconSize?.takeIf { it > 0f } ?: defaultIconSizeDp

    // Material allows only one icon size for all items; iconBoxDp is the largest effective per-tab size.
    fun applyIconBox(iconBoxDp: Float) {
        val iconBoxPx = bottomNavigationView.dpToPx(iconBoxDp).toInt()
        if (bottomNavigationView.itemIconSize != iconBoxPx) {
            bottomNavigationView.itemIconSize = iconBoxPx
        }
    }

    // Resolved on each access: tracks the material library version and the display density.
    private val defaultIndicatorWidthPx: Int
        get() = bottomNavigationView.resources.getDimensionPixelSize(R.dimen.m3_bottom_nav_item_active_indicator_width)

    private val defaultIndicatorHeightPx: Int
        get() = bottomNavigationView.resources.getDimensionPixelSize(R.dimen.m3_bottom_nav_item_active_indicator_height)

    // Auto-scale preserves the themed default padding around the icon: default indicator minus default icon size.
    private val autoIndicatorHorizontalPaddingDp: Float
        get() = bottomNavigationView.pxToDp(defaultIndicatorWidthPx.toFloat()) - defaultIconSizeDp

    private val autoIndicatorVerticalPaddingDp: Float
        get() = bottomNavigationView.pxToDp(defaultIndicatorHeightPx.toFloat()) - defaultIconSizeDp

    internal fun effectiveIndicatorWidthDp(item: TabsContainerItem): Float =
        item.appearance?.tabBarItemActiveIndicatorWidth?.takeIf { it > 0f }
            ?: (effectiveIconSizeDp(item) + autoIndicatorHorizontalPaddingDp)

    internal fun effectiveIndicatorHeightDp(item: TabsContainerItem): Float =
        item.appearance?.tabBarItemActiveIndicatorHeight?.takeIf { it > 0f }
            ?: (effectiveIconSizeDp(item) + autoIndicatorVerticalPaddingDp)

    @SuppressLint("RestrictedApi")
    private fun applyActiveIndicatorSize(
        menuItem: MenuItem,
        item: TabsContainerItem,
        state: TabsMenuItemState,
    ): Boolean {
        val widthPx = bottomNavigationView.dpToPx(effectiveIndicatorWidthDp(item)).toInt()
        val heightPx = bottomNavigationView.dpToPx(effectiveIndicatorHeightDp(item)).toInt()
        val isAlreadyApplied =
            widthPx == (state.appliedActiveIndicatorWidthPx ?: defaultIndicatorWidthPx) &&
                heightPx == (state.appliedActiveIndicatorHeightPx ?: defaultIndicatorHeightPx)
        if (isAlreadyApplied) {
            return true
        }
        val itemView =
            bottomNavigationView.menuViewGroup.children.firstOrNull { it.id == menuItem.itemId } as? NavigationBarItemView
                ?: return false
        // NavigationBarItemView is restricted Material API. Without it, Material only offers one active
        // indicator size for the whole tab bar (BottomNavigationView.itemActiveIndicatorWidth/Height).
        itemView.setActiveIndicatorWidth(widthPx)
        itemView.setActiveIndicatorHeight(heightPx)

        state.appliedActiveIndicatorWidthPx = widthPx
        state.appliedActiveIndicatorHeightPx = heightPx

        return true
    }

    // Inset the icon so it renders at effectiveDp, centered within iconBoxDp.
    // Intrinsic-relative on purpose: Material FIT_CENTER-scales the drawable to the icon box,
    // so the intrinsic factor cancels and the glyph lands at effectiveDp/iconBoxDp of the box.
    private fun sizeIcon(
        icon: Drawable?,
        effectiveDp: Float,
        iconBoxDp: Float,
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

            val fontFamily =
                titleFontResolver.resolveTypeface(
                    tabBarAppearance?.tabBarItemTitleFontFamily,
                    tabBarAppearance?.tabBarItemTitleFontWeight,
                    tabBarAppearance?.tabBarItemTitleFontItalic,
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
                tabBarAppearance?.tabBarItemTitleSmallLabelFontSize?.takeIf { it > 0 }?.let(titleFontResolver::resolveTextSizePx)
                    ?: context.resources.getDimension(R.dimen.design_bottom_navigation_text_size)
            val largeFontSize =
                tabBarAppearance?.tabBarItemTitleLargeLabelFontSize?.takeIf { it > 0 }?.let(titleFontResolver::resolveTextSizePx)
                    ?: context.resources.getDimension(R.dimen.design_bottom_navigation_text_size)

            // Inactive
            smallLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, smallFontSize)
            smallLabel.typeface = fontFamily

            // Active
            largeLabel.setTextSize(TypedValue.COMPLEX_UNIT_PX, largeFontSize)
            largeLabel.typeface = fontFamily
        }
    }

    /**
     * Applies the invalidated parts of the menu item's title, icon and active indicator, and clears
     * the menu item's pending flags.
     *
     * @return The flags that were pending, so the caller can apply the parts it owns (badge,
     * accessibility).
     */
    fun updateMenuItemAppearance(
        menuItem: MenuItem,
        item: TabsContainerItem,
        state: TabsMenuItemState,
        iconBoxDp: Float,
    ): TabsItemInvalidationFlags {
        val flags = state.pendingFlags
        state.pendingFlags = TabsItemInvalidationFlags.NONE

        if (flags.containsAny(TabsItemInvalidationFlags.TITLE)) {
            menuItem.title = item.tabTitle
        }

        if (flags.containsAny(TabsItemInvalidationFlags.ICON or TabsItemInvalidationFlags.ICON_SIZE)) {
            // Sized per slot: a StateListDrawable's intrinsic size follows its current state, so a
            // single inset computed from one child would mis-size the other when their resolutions differ.
            val effectiveDp = effectiveIconSizeDp(item)
            val iconDrawable = sizeIcon(item.iconDrawable, effectiveDp, iconBoxDp)
            val selectedIconDrawable = sizeIcon(item.selectedIconDrawable, effectiveDp, iconBoxDp)
            menuItem.icon =
                if (selectedIconDrawable != null && iconDrawable != null) {
                    StateListDrawable().apply {
                        addState(intArrayOf(android.R.attr.state_checked), selectedIconDrawable.mutate())
                        addState(intArrayOf(), iconDrawable.mutate())
                    }
                } else {
                    iconDrawable
                }
        }

        if (flags.containsAny(TabsItemInvalidationFlags.ICON_SIZE or TabsItemInvalidationFlags.ACTIVE_INDICATOR_SIZE) &&
            !applyActiveIndicatorSize(menuItem, item, state)
        ) {
            // The menu item's view doesn't exist yet; retry on the next update.
            state.pendingFlags = state.pendingFlags or TabsItemInvalidationFlags.ACTIVE_INDICATOR_SIZE
        }

        return flags
    }

    internal fun updateBadgeAppearance(
        context: Context,
        menuItem: MenuItem,
        item: TabsContainerItem,
        appearance: TabsAppearance?,
    ) {
        val menuItemId = menuItem.itemId
        val badgeValue = item.badgeValue

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
