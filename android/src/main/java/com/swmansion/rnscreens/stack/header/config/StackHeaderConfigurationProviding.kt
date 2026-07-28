package com.swmansion.rnscreens.stack.header.config

import android.graphics.Typeface
import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuConfig

/**
 * Applies font family / weight / style overrides onto a base [Typeface]. The base
 * is the slot's Material default (read after resetting the default text appearance),
 * so unset dimensions inherit the default rather than the system font.
 */
internal typealias TypefaceTransform = (Typeface?) -> Typeface

internal interface StackHeaderConfigurationProviding {
    val type: StackHeaderType
    val title: String
    val subtitle: String
    val hidden: Boolean
    val transparent: Boolean
    val backButtonHidden: Boolean
    val backButtonTintColorNormal: Int?
    val backButtonTintColorPressed: Int?
    val backButtonTintColorFocused: Int?
    val backButtonIcon: Drawable?
    val overflowIconTintColorNormal: Int?
    val overflowIconTintColorPressed: Int?
    val overflowIconTintColorFocused: Int?
    val overflowIcon: Drawable?
    val scrollFlagScroll: Boolean
    val scrollFlagEnterAlways: Boolean
    val scrollFlagEnterAlwaysCollapsed: Boolean
    val scrollFlagExitUntilCollapsed: Boolean
    val scrollFlagSnap: Boolean
    val liftOnScroll: Boolean
    val leadingSubview: StackHeaderSubviewProviding?
    val centerSubview: StackHeaderSubviewProviding?
    val trailingSubview: StackHeaderSubviewProviding?
    val backgroundSubview: StackHeaderSubviewProviding?
    val toolbarMenu: StackHeaderToolbarMenuConfig
    val toolbarMenuGroupDividerEnabled: Boolean

    val titleCentered: Boolean
    val subtitleCentered: Boolean
    val expandedTitleHorizontalGravity: Int
    val expandedTitleVerticalGravity: Int
    val collapsedTitleHorizontalGravity: Int
    val collapsedTitleVerticalGravity: Int
    val collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityMode

    val titleColor: Int?
    val titleTypefaceTransform: TypefaceTransform?
    val titleFontSize: Float?
    val subtitleColor: Int?
    val subtitleTypefaceTransform: TypefaceTransform?
    val subtitleFontSize: Float?

    val expandedTitleColor: Int?
    val expandedTitleTypefaceTransform: TypefaceTransform?
    val expandedTitleFontSize: Float?
    val collapsedTitleColor: Int?
    val collapsedTitleTypefaceTransform: TypefaceTransform?
    val collapsedTitleFontSize: Float?

    val expandedSubtitleColor: Int?
    val expandedSubtitleTypefaceTransform: TypefaceTransform?
    val expandedSubtitleFontSize: Float?
    val collapsedSubtitleColor: Int?
    val collapsedSubtitleTypefaceTransform: TypefaceTransform?
    val collapsedSubtitleFontSize: Float?

    val isRTL: Boolean

    val invalidationFlags: StackHeaderInvalidationFlags

    fun clearInvalidationFlags(flags: StackHeaderInvalidationFlags)

    fun setConfigurationObserver(observer: StackHeaderConfigurationObserver?)
}
