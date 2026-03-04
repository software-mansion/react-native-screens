package com.swmansion.rnscreens.gamma.tabs.appearance

internal data class TabsAppearance(
    val tabBarBackgroundColor: Int? = null,
    val tabBarItemRippleColor: Int? = null,
    val tabBarItemLabelVisibilityMode: String? = null,
    val normal: ItemStateAppearance? = null,
    val selected: ItemStateAppearance? = null,
    val focused: ItemStateAppearance? = null,
    val disabled: ItemStateAppearance? = null,
    val tabBarItemActiveIndicatorColor: Int? = null,
    val tabBarItemActiveIndicatorEnabled: Boolean? = null,
    val tabBarItemTitleFontFamily: String? = null,
    val tabBarItemTitleSmallLabelFontSize: Float? = null,
    val tabBarItemTitleLargeLabelFontSize: Float? = null,
    val tabBarItemTitleFontWeight: String? = null,
    val tabBarItemTitleFontStyle: String? = null,
    val tabBarItemBadgeBackgroundColor: Int? = null,
    val tabBarItemBadgeTextColor: Int? = null,
)

internal data class ItemStateAppearance(
    val tabBarItemIconColor: Int? = null,
    val tabBarItemTitleFontColor: Int? = null,
)
