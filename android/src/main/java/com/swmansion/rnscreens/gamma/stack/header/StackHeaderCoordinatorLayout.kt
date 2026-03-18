package com.swmansion.rnscreens.gamma.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.swmansion.rnscreens.gamma.stack.host.StackContainer
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderType

@SuppressLint("ViewConstructor")
internal class StackHeaderCoordinatorLayout(
    context: Context,
    internal val stackScreen: StackScreen,
) : CoordinatorLayout(context) {
    private val headerCoordinator =
        StackHeaderCoordinator(context) { headerHeight ->
            stackScreen.updateStateIfNeeded(y = headerHeight)
        }

    internal var stackScreenWrapper: FrameLayout

    init {
        // Needed when Transition API is in use to ensure that shadows do not disappear,
        // views do not jump around the screen and whole subtree is animated as a whole.
        isTransitionGroup = true

        // Due to how we're synchronizing native & Yoga layout (via contentOriginOffset on
        // StackScreen), we can't use StackScreen directly as a child of CoordinatorLayout because
        // SurfaceMountingManager will override Y offset (that depends on the header height) with
        // Y=0. If we wrap StackScreen in another view, as Y is relative to parent view, value set
        // by Yoga will be correct.
        stackScreenWrapper = FrameLayout(context).apply { addView(stackScreen) }
        addView(
            stackScreenWrapper,
            LayoutParams(MATCH_PARENT, MATCH_PARENT),
        )

        // TODO: debug-only, this will be sent in reaction to information from "HeaderConfig" component.
        applyHeaderConfiguration(
            object : StackHeaderConfigurationProviding {
                override val headerType = StackHeaderType.LARGE
                override val title = "Hello, World!"
                override val isHidden = false
                override val isTransparent = false
            },
        )

        // TODO: debug only, until we expose props via JS
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

    /**
     * Will crash in case parent is not StackContainer.
     */
    private fun stackContainerOrNull(): StackContainer? = this.parent as StackContainer?

    // TODO: do we need to rely on parent here?
    internal fun maybeRequestLayoutContainer() {
        post {
            stackContainerOrNull()?.forceSubtreeMeasureAndLayoutPass()
        }
    }

    internal fun applyHeaderConfiguration(headerConfigurationProviding: StackHeaderConfigurationProviding) =
        headerCoordinator.applyHeaderConfiguration(this, headerConfigurationProviding)
}
