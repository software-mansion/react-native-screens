package com.swmansion.rnscreens.gamma.stack.header.config

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuConfig

internal interface StackHeaderConfigurationProviding {
    val type: StackHeaderType
    val title: String
    val hidden: Boolean
    val transparent: Boolean
    val backButtonHidden: Boolean
    val backButtonTintColorNormal: Int?
    val backButtonTintColorPressed: Int?
    val backButtonTintColorFocused: Int?
    val backButtonIcon: Drawable?
    val scrollFlagScroll: Boolean
    val scrollFlagEnterAlways: Boolean
    val scrollFlagEnterAlwaysCollapsed: Boolean
    val scrollFlagExitUntilCollapsed: Boolean
    val scrollFlagSnap: Boolean
    val leadingSubview: StackHeaderSubviewProviding?
    val centerSubview: StackHeaderSubviewProviding?
    val trailingSubview: StackHeaderSubviewProviding?
    val backgroundSubview: StackHeaderSubviewProviding?
    val toolbarMenu: StackHeaderToolbarMenuConfig
    val toolbarMenuGroupDividerEnabled: Boolean
    val isRTL: Boolean

    val invalidationFlags: StackHeaderInvalidationFlags

    fun clearInvalidationFlags(flags: StackHeaderInvalidationFlags)

    fun setConfigurationObserver(observer: StackHeaderConfigurationObserver?)
}
