package com.swmansion.rnscreens.stack.header.config

import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.common.text.TextAppearance
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.stack.header.toolbar.StackHeaderToolbarMenuController

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
    val backgroundColor: Int?
    val scrolledBackgroundColor: Int?
    val statusBarScrimColor: Int?
    val leadingSubview: StackHeaderSubviewProviding?
    val centerSubview: StackHeaderSubviewProviding?
    val trailingSubview: StackHeaderSubviewProviding?
    val backgroundSubview: StackHeaderSubviewProviding?
    val toolbarMenuController: StackHeaderToolbarMenuController

    val titleCentered: Boolean
    val subtitleCentered: Boolean
    val expandedTitleHorizontalGravity: Int
    val expandedTitleVerticalGravity: Int
    val collapsedTitleHorizontalGravity: Int
    val collapsedTitleVerticalGravity: Int
    val collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityMode

    val contentInsetStart: Float?
    val contentInsetEnd: Float?

    val titleAppearance: TextAppearance
    val subtitleAppearance: TextAppearance

    val expandedTitleAppearance: TextAppearance
    val collapsedTitleAppearance: TextAppearance
    val expandedSubtitleAppearance: TextAppearance
    val collapsedSubtitleAppearance: TextAppearance

    val isRTL: Boolean

    /**
     * `true` while more updates may still arrive in the current batch (for a
     * React-owned config: inside a mount transaction). Observers should hold
     * their flush until the batch ends ([StackHeaderConfigurationObserver.onFlushRequested]).
     */
    val isUpdatePending: Boolean

    fun setConfigurationObserver(observer: StackHeaderConfigurationObserver?)
}
