package com.swmansion.rnscreens.stack.header.config

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.common.text.TextAppearance
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuConfig

internal interface StackHeaderConfigurationProviding {
    val type: StackHeaderType
    val title: String
    val subtitle: String
    val maxLines: Int
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

    val titleAppearance: TextAppearance
    val subtitleAppearance: TextAppearance

    val expandedTitleAppearance: TextAppearance
    val collapsedTitleAppearance: TextAppearance
    val expandedSubtitleAppearance: TextAppearance
    val collapsedSubtitleAppearance: TextAppearance

    val isRTL: Boolean

    val invalidationFlags: StackHeaderInvalidationFlags

    fun clearInvalidationFlags(flags: StackHeaderInvalidationFlags)

    fun setConfigurationObserver(observer: StackHeaderConfigurationObserver?)
}
