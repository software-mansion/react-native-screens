package com.swmansion.rnscreens.gamma.tabs.appearance

internal data class AndroidTabsAppearance(
    val backgroundColor: Int? = null,
    val itemColors: BottomNavItemColors? = null,
    val activeIndicator: ActiveIndicatorAppearance? = null,
    val itemRippleColor: Int? = null,
    val labelVisibilityMode: String? = null,
    val typography: TypographyAppearance? = null,
    val badge: BadgeAppearance? = null,
)

internal data class BottomNavItemColors(
    val normal: ItemStateColors? = null,
    val selected: ItemStateColors? = null,
    val disabled: ItemStateColors? = null,
    val focused: ItemStateColors? = null,
)

internal data class ItemStateColors(
    val iconColor: Int? = null,
    val titleColor: Int? = null,
)

internal data class ActiveIndicatorAppearance(
    val enabled: Boolean? = null,
    val color: Int? = null,
)

internal data class TypographyAppearance(
    val fontFamily: String? = null,
    val fontSizeSmall: Float? = null,
    val fontSizeLarge: Float? = null,
    val fontWeight: String? = null,
    val fontStyle: String? = null,
)

internal data class BadgeAppearance(
    val textColor: Int? = null,
    val backgroundColor: Int? = null,
)
