package com.swmansion.rnscreens.gamma.stack.screen.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.appbar.AppBarLayout
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderType

@SuppressLint("ViewConstructor")
internal class StackScreenCoordinatorLayout(
    context: Context,
    stackScreen: StackScreen,
) : CoordinatorLayout(context) {
    private val headerCoordinator = StackScreenHeaderCoordinator(context)

    init {
        // Needed when Transition API is in use to ensure that shadows do not disappear,
        // views do not jump around the screen and whole sub-tree is animated as a whole.
        isTransitionGroup = true

        addView(
            stackScreen,
            LayoutParams(MATCH_PARENT, MATCH_PARENT).apply {
                // TODO: when adding possibility to hide the header, this needs to be moved to coordinator
                behavior = AppBarLayout.ScrollingViewBehavior()
            },
        )

        // TODO: debug-only
        applyHeaderConfiguration(
            object : StackScreenHeaderConfigurationProviding {
                override val headerType = StackScreenHeaderType.LARGE
                override val title = "Hello, World!"
            },
        )
    }

    internal fun applyHeaderConfiguration(headerConfigurationProviding: StackScreenHeaderConfigurationProviding) =
        headerCoordinator.applyHeaderConfiguration(this, headerConfigurationProviding)
}
