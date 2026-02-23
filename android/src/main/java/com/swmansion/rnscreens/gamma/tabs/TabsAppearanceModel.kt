package com.swmansion.rnscreens.gamma.tabs

data class AndroidTabsAppearance(
    val backgroundColor: Int? = null,
    val itemColors: BottomNavItemColors? = null,
    val activeIndicator: ActiveIndicatorAppearance? = null,
    val itemRippleColor: Int? = null,
    val labelVisibilityMode: String? = null,
    val typography: TypographyAppearance? = null,
    val badge: BadgeAppearance? = null,
)

data class BottomNavItemColors(
    val normal: ItemStateColors? = null,
    val selected: ItemStateColors? = null,
    val disabled: ItemStateColors? = null,
    val focused: ItemStateColors? = null,
)

data class ItemStateColors(
    val iconColor: Int? = null,
    val titleColor: Int? = null,
)

data class ActiveIndicatorAppearance(
    val enabled: Boolean? = null,
    val color: Int? = null,
)

data class TypographyAppearance(
    val fontFamily: String? = null,
    val fontSizeSmall: Float? = null,
    val fontSizeLarge: Float? = null,
    val fontWeight: String? = null,
    val fontStyle: String? = null,
)

data class BadgeAppearance(
    val textColor: Int? = null,
    val backgroundColor: Int? = null,
)
