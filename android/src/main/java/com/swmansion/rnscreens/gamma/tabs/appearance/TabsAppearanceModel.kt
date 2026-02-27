package com.swmansion.rnscreens.gamma.tabs.appearance

internal data class AndroidTabsAppearance(
    val backgroundColor: Int? = null,
    val tabBarItemStatesColors: ItemAppearance? = null,
    val tabBarActiveIndicatorAppearance: TabBarActiveIndicatorAppearance? = null,
    val itemRippleColor: Int? = null,
    val labelVisibilityMode: String? = null,
    val tabBarItemTitleTypography: TabBarItemTitleTypographyAppearance? = null,
    val tabBarItemBadgeAppearance: TabBarItemBadgeAppearance? = null,
)

internal data class ItemAppearance(
    val normal: ItemStateAppearance? = null,
    val selected: ItemStateAppearance? = null,
    val disabled: ItemStateAppearance? = null,
    val focused: ItemStateAppearance? = null,
)

internal data class ItemStateAppearance(
    val tabBarItemIconColor: Int? = null,
    val tabBarItemTitleColor: Int? = null,
)

internal data class TabBarActiveIndicatorAppearance(
    val tabBarActiveIndicatorEnabled: Boolean? = null,
    val tabBarActiveIndicatorColor: Int? = null,
)

internal data class TabBarItemTitleTypographyAppearance(
    val tabBarItemTitleFontFamily: String? = null,
    val tabBarItemTitleFontSizeSmall: Float? = null,
    val tabBarItemTitleFontSizeLarge: Float? = null,
    val tabBarItemTitleFontWeight: String? = null,
    val tabBarItemTitleFontStyle: String? = null,
)

internal data class TabBarItemBadgeAppearance(
    val tabBarItemBadgeTextColor: Int? = null,
    val tabBarItemBadgeBackgroundColor: Int? = null,
)
