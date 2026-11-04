package com.swmansion.rnscreens.core.containers.tabs.appearance

/**
 * The tab bar takes the selected tab's appearance, in parts: shared appearance, badge colours and
 * title fonts (see the `hasSame…As` functions below). Icon size and active indicator size are each
 * tab's own. A new property has to join one of them.
 */
data class TabsAppearance(
    val tabBarBackgroundColor: Int? = null,
    val tabBarItemRippleColor: Int? = null,
    val tabBarItemLabelVisibilityMode: String? = null,
    val normal: ItemStateAppearance? = null,
    val selected: ItemStateAppearance? = null,
    val focused: ItemStateAppearance? = null,
    val disabled: ItemStateAppearance? = null,
    val tabBarItemIconSize: Float? = null,
    val tabBarItemActiveIndicatorColor: Int? = null,
    val tabBarItemActiveIndicatorEnabled: Boolean? = null,
    val tabBarItemActiveIndicatorWidth: Float? = null,
    val tabBarItemActiveIndicatorHeight: Float? = null,
    val tabBarItemTitleFontFamily: String? = null,
    val tabBarItemTitleSmallLabelFontSize: Float? = null,
    val tabBarItemTitleLargeLabelFontSize: Float? = null,
    val tabBarItemTitleFontWeight: Int? = null,
    val tabBarItemTitleFontItalic: Boolean? = null,
    val tabBarItemBadgeBackgroundColor: Int? = null,
    val tabBarItemBadgeTextColor: Int? = null,
)

data class ItemStateAppearance(
    val tabBarItemIconColor: Int? = null,
    val tabBarItemTitleFontColor: Int? = null,
)

/**
 * Compares what [TabsAppearanceApplicator.updateSharedAppearance] applies.
 */
internal fun TabsAppearance?.hasSameSharedAppearanceAs(other: TabsAppearance?): Boolean =
    this?.tabBarBackgroundColor == other?.tabBarBackgroundColor &&
        this?.tabBarItemRippleColor == other?.tabBarItemRippleColor &&
        this?.tabBarItemLabelVisibilityMode == other?.tabBarItemLabelVisibilityMode &&
        this?.normal == other?.normal &&
        this?.selected == other?.selected &&
        this?.focused == other?.focused &&
        this?.disabled == other?.disabled &&
        this?.tabBarItemActiveIndicatorColor == other?.tabBarItemActiveIndicatorColor &&
        this?.tabBarItemActiveIndicatorEnabled == other?.tabBarItemActiveIndicatorEnabled

/**
 * Compares the colours [TabsAppearanceApplicator.updateBadgeAppearance] takes from the selected tab.
 */
internal fun TabsAppearance?.hasSameBadgeAppearanceAs(other: TabsAppearance?): Boolean =
    this?.tabBarItemBadgeBackgroundColor == other?.tabBarItemBadgeBackgroundColor &&
        this?.tabBarItemBadgeTextColor == other?.tabBarItemBadgeTextColor

/**
 * Compares what [TabsAppearanceApplicator.updateFontStyles] applies.
 */
internal fun TabsAppearance?.hasSameTitleFontAs(other: TabsAppearance?): Boolean =
    this?.tabBarItemTitleFontFamily == other?.tabBarItemTitleFontFamily &&
        this?.tabBarItemTitleSmallLabelFontSize == other?.tabBarItemTitleSmallLabelFontSize &&
        this?.tabBarItemTitleLargeLabelFontSize == other?.tabBarItemTitleLargeLabelFontSize &&
        this?.tabBarItemTitleFontWeight == other?.tabBarItemTitleFontWeight &&
        this?.tabBarItemTitleFontItalic == other?.tabBarItemTitleFontItalic
