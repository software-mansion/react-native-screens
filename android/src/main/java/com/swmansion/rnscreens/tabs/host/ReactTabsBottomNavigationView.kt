package com.swmansion.rnscreens.tabs.host

import android.annotation.SuppressLint
import android.content.Context
import androidx.core.view.isVisible
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.swmansion.rnscreens.tabs.container.TabsBottomNavigationView
import com.swmansion.rnscreens.tabs.container.TabsContainer

@SuppressLint("ViewConstructor") // Should not be restored & should only be constructed by us.
internal class ReactTabsBottomNavigationView(
    context: Context,
    container: TabsContainer,
) : TabsBottomNavigationView(context, container),
    ReactPointerEventsView {
    /**
     * The tab bar is hidden by setting its visibility to `GONE`. A `GONE` view is skipped by its
     * parent's layout pass, so it keeps the bounds it was last laid out with, and Android's own
     * touch dispatch ignores it (`ViewGroup.canViewReceivePointerEvents` requires `VISIBLE`).
     *
     * React Native does not go through Android's dispatch to pick a touch target - it runs its own
     * hit-test over the native view tree in `TouchTargetHelper`, which only checks bounds. The
     * retained bounds of the hidden bar therefore keep capturing every touch aimed at the content
     * laid out underneath it. Declaring [PointerEvents.NONE] while hidden is how a native view opts
     * out of that hit-test, which brings it back in line with Android's dispatch.
     *
     * See https://github.com/software-mansion/react-native-screens/issues/4132.
     */
    override val pointerEvents: PointerEvents
        get() = if (isVisible) PointerEvents.AUTO else PointerEvents.NONE
}
