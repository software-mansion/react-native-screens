package com.swmansion.rnscreens.gamma.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.activity.OnBackPressedDispatcherOwner
import androidx.appcompat.view.ContextThemeWrapper
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.ReactContext
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.swmansion.rnscreens.gamma.stack.header.config.OnHeaderConfigurationAttachListener
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigurationObserver
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderDelegate
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderUpdateFlags
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen

@SuppressLint("ViewConstructor")
internal class StackHeaderCoordinatorLayout(
    context: Context,
    internal val stackScreen: StackScreen,
    private val canNavigateBack: Boolean,
) : CoordinatorLayout(context) {
    // region Config attach / detach

    private var currentProvider: StackHeaderConfigurationProviding? = null
    private var currentDelegate: StackHeaderDelegate? = null

    private val onHeaderConfigAttached =
        OnHeaderConfigurationAttachListener { provider, delegate ->
            handleHeaderConfigAttach(provider, delegate)
        }

    private fun handleHeaderConfigAttach(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    ) {
        currentProvider?.setConfigurationObserver(null)

        currentProvider = provider
        currentDelegate = delegate

        if (provider != null) {
            provider.setConfigurationObserver(configObserver)
        } else {
            removeHeader()
        }
    }

    // endregion

    // region Init

    internal var stackScreenWrapper: FrameLayout

    init {
        isTransitionGroup = true

        stackScreenWrapper = FrameLayout(context).apply { addView(stackScreen) }
        addView(
            stackScreenWrapper,
            LayoutParams(MATCH_PARENT, MATCH_PARENT),
        )

        stackScreen.registerHeaderConfigAttachListener(onHeaderConfigAttached)
    }

    // endregion

    // region Configuration observer

    private val configObserver =
        object : StackHeaderConfigurationObserver {
            override fun onConfigChanged(
                config: StackHeaderConfigurationProviding,
                flags: StackHeaderUpdateFlags,
            ) = processUpdate(config, flags)

            override fun onMenuItemUpdated(
                id: String,
                options: StackHeaderToolbarMenuItemOptions,
            ) {
                val toolbar = appBarLayout?.toolbar ?: return
                applicator.updateToolbarMenuItem(toolbar, toolbarMenuForwardIdMap, id, options)
            }
        }

    // endregion

    // region Layout callbacks

    private val appBarOffsetListener =
        AppBarLayout.OnOffsetChangedListener { _, _ ->
            onMaybeHeaderLayoutChanged()
        }

    private val appBarLayoutChangeListener =
        OnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            onMaybeHeaderLayoutChanged()
        }

    private fun attachAppBarListeners(appBar: StackHeaderAppBarLayout) {
        appBar.addOnOffsetChangedListener(appBarOffsetListener)
        appBar.addOnLayoutChangeListener(appBarLayoutChangeListener)
    }

    private fun detachAppBarListeners(appBar: StackHeaderAppBarLayout) {
        appBar.removeOnOffsetChangedListener(appBarOffsetListener)
        appBar.removeOnLayoutChangeListener(appBarLayoutChangeListener)
    }

    private fun onMaybeHeaderLayoutChanged() {
        val delegate = currentDelegate ?: return
        val provider = currentProvider ?: return
        val appBar = appBarLayout ?: return

        val configOffset = if (provider.transparent) appBar.top else appBar.top - appBar.bottom

        delegate.onHeaderFrameChanged(
            appBar.width,
            appBar.height,
            configOffset,
        )

        updateSubviewOffsets(appBar, provider)
    }

    private fun updateSubviewOffsets(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        config.leadingSubview?.let { updateSubviewOffset(it, appBar) }
        config.centerSubview?.let { updateSubviewOffset(it, appBar) }
        config.trailingSubview?.let { updateSubviewOffset(it, appBar) }
        config.backgroundSubview?.let { updateSubviewOffset(it, appBar) }
    }

    private fun updateSubviewOffset(
        subview: StackHeaderSubviewProviding,
        appBar: StackHeaderAppBarLayout,
    ) {
        val view = subview.view
        if (view.width == 0 && view.height == 0) return

        val appBarPos = IntArray(2)
        val subviewPos = IntArray(2)
        appBar.getLocationInWindow(appBarPos)
        view.getLocationInWindow(subviewPos)

        currentDelegate?.onSubviewOriginChanged(
            subview.type,
            x = subviewPos[0] - appBarPos[0],
            y = subviewPos[1] - appBarPos[1],
        )
    }

    // endregion

    // region Header updates

    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    private val applicator = StackHeaderApplicator(wrappedContext)

    private var appBarLayout: StackHeaderAppBarLayout? = null

    private var toolbarMenuForwardIdMap = emptyMap<String, Int>()
    private var toolbarMenuReverseIdMap = emptyMap<Int, String>()

    private val onNavigationIconClick: () -> Unit = {
        val activity =
            (stackScreen.context as? ReactContext)?.currentActivity
                    as? OnBackPressedDispatcherOwner
        activity?.onBackPressedDispatcher?.onBackPressed()
    }

    private fun processUpdate(
        provider: StackHeaderConfigurationProviding,
        flags: StackHeaderUpdateFlags,
    ) {
        var activeFlags = flags

        if (activeFlags.needsRebuild) {
            resetHeader()
            if (!provider.hidden) {
                val appBar = applicator.rebuild(this, provider)
                appBarLayout = appBar
                attachAppBarListeners(appBar)
            } else {
                removeContentBehavior()
                requestLayout()
            }
            activeFlags =
                StackHeaderUpdateFlags.ALL.clearing(
                    StackHeaderUpdateFlags.STRUCTURE or StackHeaderUpdateFlags.SUBVIEWS,
                )
        }

        val appBar = appBarLayout
        if (appBar != null) {
            if (activeFlags.containsAny(StackHeaderUpdateFlags.TITLE)) {
                applicator.applyTitle(appBar, provider)
            }
            if (activeFlags.containsAny(StackHeaderUpdateFlags.BACK_BUTTON)) {
                applicator.applyBackButton(appBar.toolbar, provider, canNavigateBack, onNavigationIconClick)
            }
            if (activeFlags.containsAny(StackHeaderUpdateFlags.SCROLL_FLAGS)) {
                applicator.applyScrollFlags(appBar, provider)
            }
            if (activeFlags.containsAny(StackHeaderUpdateFlags.TOOLBAR_MENU)) {
                val (fwd, rev) =
                    applicator.rebuildToolbarMenu(
                        appBar.toolbar,
                        provider.toolbarMenuItems,
                    ) { id -> currentDelegate?.onMenuItemClicked(id) }
                toolbarMenuForwardIdMap = fwd
                toolbarMenuReverseIdMap = rev
            }
        }

        onMaybeHeaderLayoutChanged()
    }

    // endregion

    // region Header lifecycle

    private fun resetHeader() {
        appBarLayout?.let {
            detachAppBarListeners(it)
            removeView(it)
        }
        appBarLayout = null
        toolbarMenuForwardIdMap = emptyMap()
        toolbarMenuReverseIdMap = emptyMap()
    }

    private fun removeHeader() {
        resetHeader()
        removeContentBehavior()
        requestLayout()
    }

    // endregion

    // region Content behavior

    internal fun setContentBehavior() {
        val params = stackScreenWrapper.layoutParams as LayoutParams
        if (params.behavior == null) {
            params.behavior =
                StackHeaderScrollingViewBehavior { contentTop, _ ->
                    stackScreen.onContentYOriginChanged(contentTop)
                }
            stackScreenWrapper.layoutParams = params
            stackScreenWrapper.requestLayout()
        }
    }

    internal fun removeContentBehavior() {
        val params = stackScreenWrapper.layoutParams as LayoutParams
        if (params.behavior != null) {
            params.behavior = null
            stackScreenWrapper.layoutParams = params
            stackScreen.onContentYOriginChanged(0)
            stackScreenWrapper.requestLayout()
        }
    }

    // endregion

    // region Teardown

    internal fun tearDown() {
        resetHeader()

        stackScreenWrapper.removeView(stackScreen)

        currentProvider?.setConfigurationObserver(null)
        currentProvider = null
        currentDelegate = null

        stackScreen.clearHeaderConfigAttachListener()
    }

    // endregion
}
