package com.swmansion.rnscreens.tabs.screen

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.swmansion.rnscreens.helpers.ViewIdGenerator

class TabsScreenFragment(
    internal val tabsScreen: TabsScreen,
) : Fragment() {
    internal val requireScreenKey: String by tabsScreen::requireScreenKey
    internal val isPreventNativeSelectionEnabled: Boolean by tabsScreen::preventNativeSelection

    internal val menuItemId: Int = ViewIdGenerator.generateViewId()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = tabsScreen

    override fun onStart() {
        tabsScreen.eventEmitter.emitOnWillAppear()
        super.onStart()
    }

    override fun onResume() {
        tabsScreen.eventEmitter.emitOnDidAppear()
        super.onResume()
    }

    override fun onPause() {
        tabsScreen.eventEmitter.emitOnWillDisappear()
        super.onPause()
    }

    override fun onStop() {
        tabsScreen.eventEmitter.emitOnDidDisappear()
        super.onStop()
    }

    override fun onPrimaryNavigationFragmentChanged(isPrimaryNavigationFragment: Boolean) {
        super.onPrimaryNavigationFragmentChanged(isPrimaryNavigationFragment)
        // FragmentManager's recursion continues into this tab's child FragmentManager and notifies
        // ITS primary fragment - the top screen of a stack nested in this tab - which re-evaluates
        // the container nested in that screen, not the stack this tab hosts. Hence this hook.
        tabsScreen.resolveNestedContainer()?.onOwnerPrimaryNavigationFragmentChanged()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        // Handle theme change through RN's Appearance.setColorScheme
        tabsScreen.onFragmentConfigurationChange(this, newConfig)
    }
}
