package com.swmansion.rnscreens.gamma.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.swmansion.rnscreens.gamma.stack.header.configuration.OnHeaderConfigurationAttachListener
import com.swmansion.rnscreens.gamma.stack.header.configuration.OnHeaderConfigurationChangeListener
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfiguration
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

    /**
     * This callback is used to detect when header configuration is attached.
     * This allows us to configure listener for header configuration changes.
     */
    private val onHeaderConfigurationAttach =
        OnHeaderConfigurationAttachListener { config ->
            handleHeaderConfigurationAttach(config)
        }

    private var isHeaderUpdatePending = false

    /**
     * This callback is used to listen for header configuration changes.
     * We use [isHeaderUpdatePending] to batch changes and pass them to [headerCoordinator].
     */
    private val onHeaderConfigurationChange =
        OnHeaderConfigurationChangeListener { config ->
            if (!isHeaderUpdatePending) {
                isHeaderUpdatePending = true
                post {
                    isHeaderUpdatePending = false
                    applyHeaderConfiguration(config)
                }
            }
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

        // Setup header configuration attach listener. If header configuration is already available,
        // use it immediately.
        stackScreen.onHeaderConfigurationAttachListener = WeakReference(onHeaderConfigurationAttach)
        stackScreen.headerConfiguration?.let { handleHeaderConfigurationAttach(it) }
    }

    internal fun maybeRequestLayoutContainer() {
        // TODO: do we need to rely on parent here?
        post {
            stackContainerOrNull()?.forceSubtreeMeasureAndLayoutPass()
        }
    }

    internal fun applyHeaderConfiguration(config: StackHeaderConfigurationProviding) =
        headerCoordinator.applyHeaderConfiguration(this, config)

    private fun handleHeaderConfigurationAttach(config: StackHeaderConfiguration?) {
        if (config != null) {
            config.onConfigurationChangeListener = WeakReference(onHeaderConfigurationChange)
            applyHeaderConfiguration(config)
        }
    }

    /**
     * Will crash in case parent is not StackContainer.
     */
    private fun stackContainerOrNull(): StackContainer? = this.parent as StackContainer?
}
