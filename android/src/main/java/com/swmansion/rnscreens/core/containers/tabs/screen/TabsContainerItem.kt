package com.swmansion.rnscreens.core.containers.tabs.screen

import android.content.res.Configuration
import android.graphics.drawable.Drawable
import android.view.View
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.core.containers.common.ContainerItem
import com.swmansion.rnscreens.core.containers.tabs.appearance.TabsAppearance

/**
 * What the tabs container, its fragments and the tab bar need from an item of the tabs.
 */
internal interface TabsContainerItem : ContainerItem {
    /**
     * The view displaying the tab's content.
     */
    val view: View

    val itemKey: String?

    val tabTitle: String?

    val iconDrawable: Drawable?

    val selectedIconDrawable: Drawable?

    val badgeValue: String?

    val tabBarItemTestID: String?

    val tabBarItemAccessibilityLabel: String?

    val appearance: TabsAppearance?

    val shouldUseRepeatedTabSelectionScrollToTopSpecialEffect: Boolean

    val shouldUseRepeatedTabSelectionPopToRootSpecialEffect: Boolean

    val preventNativeSelection: Boolean

    val appearanceEventEmitter: ViewAppearanceEventEmitter

    /**
     * Sets the observer the item reports its configuration changes to; `null` clears it.
     */
    fun setConfigurationObserver(observer: TabsItemConfigurationObserver?)

    /**
     * The item's fragment received a configuration update.
     *
     * There are cases where the fragment will receive configuration change, but its view will not,
     * e.g. theme update from JS via Appearance.setColorScheme.
     */
    fun onFragmentConfigurationChange(config: Configuration)
}
