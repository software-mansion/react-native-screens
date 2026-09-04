package com.swmansion.rnscreens.stack.header

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.os.Parcelable
import android.util.SparseArray
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
import androidx.activity.OnBackPressedDispatcherOwner
import androidx.appcompat.view.ContextThemeWrapper
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.ReactContext
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeCoordinator
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeListener
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeProviding
import com.swmansion.rnscreens.stack.header.appbar.StackHeaderAppBarLayout
import com.swmansion.rnscreens.stack.header.appbar.StackHeaderScrollingViewBehavior
import com.swmansion.rnscreens.stack.header.config.OnHeaderConfigurationAttachListener
import com.swmansion.rnscreens.stack.header.config.StackHeaderConfigurationObserver
import com.swmansion.rnscreens.stack.header.config.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.stack.header.config.StackHeaderDelegate
import com.swmansion.rnscreens.stack.header.config.StackHeaderInvalidationFlags
import com.swmansion.rnscreens.stack.screen.StackScreen

/**
 * Root CoordinatorLayout for a screen's header: hosts the app bar and the
 * content wrapper, wires header-config attach/observe, routes config
 * invalidations to the applicators, and owns header lifecycle/teardown.
 */
@SuppressLint("ViewConstructor")
internal class StackHeaderCoordinatorLayout(
    context: Context,
    internal val stackScreen: StackScreen,
    private val canNavigateBack: Boolean,
) : CoordinatorLayout(context),
    ColorSchemeProviding {
    // region Config attach / detach

    private var currentProvider: StackHeaderConfigurationProviding? = null
    private var currentDelegate: StackHeaderDelegate? = null

    // This callback is used to detect when header config is attached.
    // This allows us to configure the delegate for header config interactions.
    private val onHeaderConfigAttached =
        OnHeaderConfigurationAttachListener { provider, delegate ->
            handleHeaderConfigAttach(provider, delegate)
        }

    private fun handleHeaderConfigAttach(
        provider: StackHeaderConfigurationProviding?,
        delegate: StackHeaderDelegate?,
    ) {
        // Disconnect old config to prevent spurious updates from a detached config.
        currentProvider?.let {
            it.setConfigurationObserver(null)
            it.toolbarMenuController.detach()
        }

        currentProvider = provider
        currentDelegate = delegate

        if (provider != null) {
            provider.setConfigurationObserver(configObserver)
            // A freshly adopted config is fully dirty by construction: this
            // coordinator has applied nothing of it yet, regardless of what a
            // previous (destroyed) coordinator consumed.
            invalidate(StackHeaderInvalidationFlags.ALL)
            flushPendingUpdates()
        } else {
            pendingFlags = StackHeaderInvalidationFlags.NONE
            removeHeader()
        }
    }

    // endregion

    // region Configuration observer

    private val configObserver =
        object : StackHeaderConfigurationObserver {
            override fun onInvalidated(flags: StackHeaderInvalidationFlags) {
                invalidate(flags)
                flushPendingUpdates()
            }

            override fun onFlushRequested() = flushPendingUpdates()
        }

    // endregion

    // region Layout callbacks

    private val appBarOffsetListener =
        AppBarLayout.OnOffsetChangedListener { appBar, verticalOffset ->
            evaluateCollapseState(appBar, verticalOffset)
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
        StackHeaderFrameSynchronizer.sync(appBar, provider, delegate)
    }

    // Tracks whether the app bar is currently scrolled to its fully collapsed offset, so
    // processUpdate can preserve the collapsed resting state across header updates (rebuilds and
    // re-measures start expanded). This should be equivalent to Material's
    // `collapsingTitleHelper.getExpansionFraction() == 1f` condition.
    private var isAppBarFullyCollapsed = false

    private fun evaluateCollapseState(
        appBar: AppBarLayout,
        verticalOffset: Int,
    ) {
        val totalScrollRange = appBar.totalScrollRange
        isAppBarFullyCollapsed = totalScrollRange > 0 && -verticalOffset >= totalScrollRange
    }

    // endregion

    // region Header updates

    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3Expressive_DayNight_NoActionBar,
        )

    private val applicator = StackHeaderApplicator(wrappedContext)

    private var appBarLayout: StackHeaderAppBarLayout? = null

    private val onNavigationIconClick: () -> Unit = {
        val activity =
            (stackScreen.context as? ReactContext)?.currentActivity
                as? OnBackPressedDispatcherOwner
        activity?.onBackPressedDispatcher?.onBackPressed()
    }

    private var pendingFlags = StackHeaderInvalidationFlags.NONE

    private fun invalidate(flags: StackHeaderInvalidationFlags) {
        pendingFlags = pendingFlags or flags
    }

    private fun flushPendingUpdates() {
        val provider = currentProvider ?: return
        if (pendingFlags.isEmpty) return
        // Hold the flush while more updates may arrive in the current batch; the batch end
        // triggers onFlushRequested.
        if (provider.isUpdatePending) return
        // While detached from window, only accumulate: onAttachedToWindow flushes once, after the
        // color scheme is resolved, so the header is built under the right theme.
        if (!isAttachedToWindow) return
        processUpdate(provider)
    }

    private fun processUpdate(provider: StackHeaderConfigurationProviding) {
        val flags = pendingFlags
        pendingFlags = StackHeaderInvalidationFlags.NONE

        val needsRebuild = flags.needsRebuild
        val wasFullyCollapsed = isAppBarFullyCollapsed

        if (needsRebuild) {
            if (provider.hidden) {
                removeHeader()
                return
            }

            resetHeader()
            val appBar = applicator.rebuild(this, provider)
            appBarLayout = appBar
            attachAppBarListeners(appBar)
        }

        val appBar = appBarLayout
        if (appBar != null) {
            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.TITLE)) {
                applicator.applyTitleAndSubtitle(appBar, provider)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.TITLE_APPEARANCE)) {
                applicator.applyTitleAndSubtitleAppearance(appBar, provider)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.TITLE_POSITIONING)) {
                applicator.applyTitlePositioning(appBar, provider)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.CONTENT_INSETS)) {
                applicator.applyContentInsets(appBar, provider)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.BACK_BUTTON)) {
                applicator.applyBackButton(appBar.toolbar, provider, canNavigateBack, onNavigationIconClick)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.SCROLL_FLAGS)) {
                applicator.applyScrollFlags(appBar, provider)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.BACKGROUND_COLORS)) {
                applicator.applyBackgroundColors(appBar, provider)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.LIFT_ON_SCROLL)) {
                // Lift-on-scroll is disabled in transparent mode: there is no content
                // scrolling behavior installed and the app bar overlays the content.
                applicator.applyLiftOnScroll(
                    appBar,
                    enabled = provider.liftOnScroll && !provider.transparent,
                    targetScrollView = stackScreen.findContentScrollView(),
                )
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.TOOLBAR_MENU)) {
                provider.toolbarMenuController.attach(appBar.toolbar)
            }

            if (needsRebuild || flags.containsAny(StackHeaderInvalidationFlags.OVERFLOW_ICON)) {
                applicator.applyOverflowIcon(appBar.toolbar, provider)
            }

            // A rebuilt or re-measured app bar starts expanded; re-assert the fully-collapsed
            // resting state so a scrolled-down screen doesn't jump. A pending action, so it wins
            // over applyScrollFlags' expand snap, and it resolves against the new configuration —
            // degrading to expanded when the header can no longer collapse. Fractional offsets
            // reset to expanded.
            if (wasFullyCollapsed) {
                appBar.setExpanded(false, false)
            }
        }

        onMaybeHeaderLayoutChanged()
    }

    // endregion

    // region Color scheme

    private val colorSchemeCoordinator = ColorSchemeCoordinator()

    // Night mode the header visuals were last applied against. Unlike the coordinator's
    // internal dedupe (reset on every setup()), this survives detach/reattach, skipping
    // redundant full re-applies e.g. on tab switches.
    private var appliedUiNightMode: Int =
        context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK

    override fun getResolvedUiNightMode() = colorSchemeCoordinator.getResolvedUiNightMode()

    override fun addColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.addColorSchemeListener(listener)

    override fun removeColorSchemeListener(listener: ColorSchemeListener) = colorSchemeCoordinator.removeColorSchemeListener(listener)

    // No onConfigurationChanged override is needed: this view never sets its own colorScheme,
    // so resolution always delegates to the parent provider, which does handle system changes.

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        // Resolve the color scheme before flushing, so a deferred first build happens under the
        // pinned theme (a scheme change inside setup() flushes by itself; the trailing flush then
        // no-ops).
        colorSchemeCoordinator.setup(this) { applyUiNightMode(it) }
        // AppBarLayout clears its liftOnScrollTargetView on window detach and never re-resolves
        // it; re-apply on every attach.
        invalidate(StackHeaderInvalidationFlags.LIFT_ON_SCROLL)
        flushPendingUpdates()
    }

    override fun onDetachedFromWindow() {
        colorSchemeCoordinator.teardown()
        super.onDetachedFromWindow()
    }

    private fun applyUiNightMode(uiNightMode: Int) {
        wrappedContext.setTheme(
            when (uiNightMode) {
                Configuration.UI_MODE_NIGHT_YES -> R.style.Theme_Material3Expressive_Dark_NoActionBar
                Configuration.UI_MODE_NIGHT_NO -> R.style.Theme_Material3Expressive_Light_NoActionBar
                else -> R.style.Theme_Material3Expressive_DayNight_NoActionBar
            },
        )

        if (uiNightMode == appliedUiNightMode) {
            return
        }

        appliedUiNightMode = uiNightMode
        // A rebuild is needed because MaterialToolbar snapshots its theme at construction:
        // ripples, the overflow popup and menu item views resolve from that frozen copy, so
        // only view recreation refreshes them.
        invalidate(StackHeaderInvalidationFlags.STRUCTURE)
        flushPendingUpdates()
    }

    // endregion

    // region Header lifecycle

    private fun resetHeader() {
        appBarLayout?.let {
            detachAppBarListeners(it)
            removeView(it)
        }
        appBarLayout = null
        currentProvider?.toolbarMenuController?.detach()
    }

    private fun removeHeader() {
        resetHeader()
        isAppBarFullyCollapsed = false
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

    // region Instance state

    override fun dispatchSaveInstanceState(container: SparseArray<Parcelable>) {
        // Do nothing. This view is the root of a fragment-managed, react-owned hierarchy that
        // React Native keeps alive, so there is no need to serialize/deserialize native view
        // state. View ids in this subtree are react tags, which are not stable identities -
        // restoring state by id can apply state saved by one view type to a different one,
        // crashing e.g. in CompoundButton (see #4523).
    }

    override fun dispatchRestoreInstanceState(container: SparseArray<Parcelable>) {
        // Ignore restoring instance state too, as we are not saving anything anyways.
    }

    // endregion

    // region Init

    internal var stackScreenWrapper: FrameLayout

    init {
        // Needed when Transition API is in use to ensure that shadows do not disappear,
        // views do not jump around the screen and whole subtree is animated as a whole.
        isTransitionGroup = true

        // Due to how we're synchronizing native & Yoga layout (via contentOriginOffset on
        // StackScreen), we can't use StackScreen directly as a child of CoordinatorLayout
        // because SurfaceMountingManager will override Y offset (that depends on the header
        // height) with Y=0. If we wrap StackScreen in another view, as Y is relative to
        // parent view, value set by Yoga will be correct.
        stackScreenWrapper = FrameLayout(context).apply { addView(stackScreen) }
        addView(
            stackScreenWrapper,
            LayoutParams(MATCH_PARENT, MATCH_PARENT),
        )

        stackScreen.registerHeaderConfigAttachListener(onHeaderConfigAttached)
    }

    // endregion

    // region Teardown

    internal fun tearDown() {
        colorSchemeCoordinator.teardown()

        pendingFlags = StackHeaderInvalidationFlags.NONE
        removeHeader()

        stackScreenWrapper.removeView(stackScreen)

        currentProvider?.setConfigurationObserver(null)
        currentProvider = null
        currentDelegate = null

        stackScreen.clearHeaderConfigAttachListener()
    }

    // endregion
}
