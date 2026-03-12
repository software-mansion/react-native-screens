package com.swmansion.rnscreens.gamma.stack.screen.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.swmansion.rnscreens.gamma.stack.host.StackContainer
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderType

@SuppressLint("ViewConstructor")
internal class StackScreenCoordinatorLayout(
    context: Context,
    internal val stackScreen: StackScreen,
) : CoordinatorLayout(context) {
    private val headerCoordinator =
        StackScreenHeaderCoordinator(context) { headerHeight ->
            stackScreen.updateStateIfNeeded(y = headerHeight)
        }

    internal var stackScreenWrapper: FrameLayout

    init {
        // Needed when Transition API is in use to ensure that shadows do not disappear,
        // views do not jump around the screen and whole sub-tree is animated as a whole.
        isTransitionGroup = true

        stackScreenWrapper = FrameLayout(context).apply { addView(stackScreen) }
        addView(
            stackScreenWrapper,
            LayoutParams(MATCH_PARENT, MATCH_PARENT),
        )

        // TODO: debug-only
        applyHeaderConfiguration(
            object : StackScreenHeaderConfigurationProviding {
                override val headerType = StackScreenHeaderType.LARGE
                override val title = "Hello, World!"
                override val isHidden = false
                override val isTransparent = false
            },
        )

//        postDelayed({
//            applyHeaderConfiguration(
//                object : StackScreenHeaderConfigurationProviding {
//                    override val headerType = StackScreenHeaderType.LARGE
//                    override val title = "Hello, World!"
//                    override val isHidden = true
//                    override val isTransparent = false
//                },
//            )
//
//            postDelayed({
//                applyHeaderConfiguration(
//                    object : StackScreenHeaderConfigurationProviding {
//                        override val headerType = StackScreenHeaderType.LARGE
//                        override val title = "Hello, World!"
//                        override val isHidden = false
//                        override val isTransparent = false
//                    },
//                )
//            }, 3000)
//        }, 3000)
    }

    private fun stackContainerOrNull(): StackContainer? = this.parent as StackContainer?

    internal fun maybeRequestLayoutContainer() {
        post {
            stackContainerOrNull()?.forceSubtreeMeasureAndLayoutPass()
        }
    }

    internal fun applyHeaderConfiguration(headerConfigurationProviding: StackScreenHeaderConfigurationProviding) =
        headerCoordinator.applyHeaderConfiguration(this, headerConfigurationProviding)
}
