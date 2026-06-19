package com.swmansion.rnscreens.gamma.stack.header.config

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig

interface StackHeaderConfigProviding {
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
    val toolbarMenuItems: List<StackHeaderToolbarMenuItemConfig>

    val isRTL: Boolean

    fun updateHeaderFrame(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    )

    fun onMenuItemClick(id: String)

    fun setDelegate(delegate: StackHeaderConfigDelegate)

    fun removeDelegate(delegate: StackHeaderConfigDelegate)
}
