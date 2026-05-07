package com.swmansion.rnscreens.gamma.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.activity.OnBackPressedDispatcherOwner
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.ReactContext
import com.swmansion.rnscreens.gamma.stack.header.config.OnHeaderConfigAttachListener
import com.swmansion.rnscreens.gamma.stack.header.config.OnHeaderConfigChangeListener
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigProviding
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor")
internal class StackHeaderCoordinatorLayout(
    context: Context,
    internal val stackScreen: StackScreen,
    canNavigateBack: Boolean,
) : CoordinatorLayout(context) {
    private val headerCoordinator =
        StackHeaderCoordinator(
            context = context,
            canNavigateBack = canNavigateBack,
            onHeaderHeightChanged = { headerHeight ->
                stackScreen.updateStateIfNeeded(y = headerHeight)
            },
            onNavigationIconClick = {
                val activity =
                    (stackScreen.context as? ReactContext)?.currentActivity
                        as? OnBackPressedDispatcherOwner
                activity?.onBackPressedDispatcher?.onBackPressed()
            },
        )

    /**
     * This callback is used to detect when header config is attached.
     * This allows us to configure listener for header config changes.
     */
    private val onHeaderConfigAttach =
        OnHeaderConfigAttachListener { config ->
            handleHeaderConfigAttach(config)
        }

    private var isHeaderUpdatePending = false

    /**
     * This callback is used to listen for header config changes.
     * We use [isHeaderUpdatePending] to batch changes and pass them to [headerCoordinator].
     */
    private val onHeaderConfigChange =
        OnHeaderConfigChangeListener {
            if (!isHeaderUpdatePending) {
                isHeaderUpdatePending = true
                // Read currentConfig when the runnable executes, not when it's posted,
                // to avoid applying a stale config that was swapped out in the meantime.
                post {
                    isHeaderUpdatePending = false
                    headerCoordinator.applyHeaderConfig(this, currentConfig)
                }
            }
        }

    private var currentConfig: StackHeaderConfigProviding? = null

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

        stackScreen.onHeaderConfigAttachListener = WeakReference(onHeaderConfigAttach)
        handleHeaderConfigAttach(stackScreen.headerConfig)
    }

    private fun handleHeaderConfigAttach(config: StackHeaderConfigProviding?) {
        // Disconnect old config to prevent spurious updates from a detached config
        currentConfig?.setOnConfigChangeListener(null)
        currentConfig = config

        config?.setOnConfigChangeListener(onHeaderConfigChange)

        // We run this even if config is null to properly remove the header if config
        // is removed in runtime.
        headerCoordinator.applyHeaderConfig(this, config)
    }
}
