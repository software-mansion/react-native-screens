package com.swmansion.rnscreens.gamma.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfiguration
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationAttachObserver
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationChangeListener
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.host.StackContainer
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import java.lang.ref.WeakReference

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

    private var isHeaderUpdatePending = false

    private val headerConfigChangeListener =
        StackHeaderConfigurationChangeListener { config ->
            if (!isHeaderUpdatePending) {
                isHeaderUpdatePending = true
                post {
                    isHeaderUpdatePending = false
                    applyHeaderConfiguration(config)
                }
            }
        }

    private val headerAttachObserver =
        StackHeaderConfigurationAttachObserver { config ->
            onHeaderConfigurationAvailable(config)
        }

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

        // Wire observer on StackScreen for header attach/detach notifications
        stackScreen.headerConfigurationAttachObserver = WeakReference(headerAttachObserver)

        // Handle case where header was already attached before this layout was created
        stackScreen.headerConfiguration?.let { onHeaderConfigurationAvailable(it) }
    }

    private fun onHeaderConfigurationAvailable(config: StackHeaderConfiguration?) {
        if (config != null) {
            // Wire header's own change listener so prop updates go directly to us
            config.configurationChangeListener = WeakReference(headerConfigChangeListener)
            applyHeaderConfiguration(config)
        } else {
            // Header removed — could reset to default state
        }
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

    internal fun applyHeaderConfiguration(config: StackHeaderConfigurationProviding) =
        headerCoordinator.applyHeaderConfiguration(this, config)
}
