package com.swmansion.rnscreens.gamma.stack.header

import android.content.Context
import android.graphics.drawable.Drawable
import android.text.TextUtils
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.widget.FrameLayout
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.AppCompatTextView
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.TextViewCompat
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL
import com.google.android.material.appbar.AppBarLayout.LayoutParams.SCROLL_FLAG_SNAP
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.ext.detachFromCurrentParent
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigProviding
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderType
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewCollapseMode
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding
import com.swmansion.rnscreens.utils.resolveDrawableAttr

internal class StackHeaderCoordinator(
    context: Context,
    private val canNavigateBack: Boolean,
    private val onHeaderHeightChanged: (headerHeight: Int) -> Unit,
    private val onNavigationIconClick: () -> Unit,
) {
    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    private var appBarLayout: StackHeaderAppBarLayout? = null
    private var currentConfig: StackHeaderConfigProviding? = null

    // Cached values used by requiresRebuild() to detect when the header
    // hierarchy needs to be torn down and recreated.
    private var lastHeaderType: StackHeaderType? = null
    private var lastHidden: Boolean = false
    private var lastTransparent: Boolean = false
    private var attachedLeadingSubview: StackHeaderSubviewProviding? = null
    private var attachedCenterSubview: StackHeaderSubviewProviding? = null
    private var attachedTrailingSubview: StackHeaderSubviewProviding? = null
    private var attachedBackgroundSubview: StackHeaderSubviewProviding? = null
    private var lastBackgroundSubviewCollapseMode: StackHeaderSubviewCollapseMode? = null

    private var lastBackButtonVisible: Boolean? = null
    private var lastBackButtonTintColor: Int? = null
    private var lastBackButtonIcon: Drawable? = null

    private var lastScrollFlags: Int? = null

    // For small header, we need to use custom title view in order to
    // render a subview to the leading side of the title.
    private var managedTitleView: AppCompatTextView? = null

    internal fun applyHeaderConfig(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigProviding?,
    ) {
        currentConfig = config
        if (config != null) {
            updateHeader(coordinatorLayout, config)
        } else {
            removeHeader(coordinatorLayout)
        }
    }

    private fun updateHeader(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigProviding,
    ) {
        if (requiresRebuild(config)) {
            rebuild(coordinatorLayout, config)
        }
        applyProps(config)
    }

    private fun removeHeader(coordinatorLayout: StackHeaderCoordinatorLayout) {
        teardown(coordinatorLayout)
        removeContentBehavior(coordinatorLayout)
        coordinatorLayout.requestLayout()
    }

    // region Rebuild detection

    private fun requiresRebuild(config: StackHeaderConfigProviding): Boolean {
        if (config.type != lastHeaderType) return true
        if (config.hidden != lastHidden) return true
        if (config.transparent != lastTransparent) return true
        if (config.leadingSubview !== attachedLeadingSubview) return true
        if (config.centerSubview !== attachedCenterSubview) return true
        if (config.trailingSubview !== attachedTrailingSubview) return true
        if (config.backgroundSubview !== attachedBackgroundSubview) return true

        if (appBarLayout is StackHeaderAppBarLayout.Collapsing) {
            if (config.backgroundSubview?.collapseMode != lastBackgroundSubviewCollapseMode) return true
        }

        return false
    }

    // endregion

    // region Full rebuild

    private fun rebuild(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigProviding,
    ) {
        teardown(coordinatorLayout)

        if (!config.hidden) {
            val appBar = StackHeaderAppBarLayout.create(wrappedContext, config.type)
            appBarLayout = appBar

            if (config.transparent) {
                removeContentBehavior(coordinatorLayout)
                coordinatorLayout.addView(appBar)
            } else {
                coordinatorLayout.addView(appBar, 0)
                setContentBehavior(coordinatorLayout)
            }

            // Make sure that we receive insets, necessary when changing header mode in runtime.
            appBar.requestApplyInsets()
            attachAppBarListeners(appBar)

            populateAppBar(appBar, config)
            maybeApplyRTLCollapsingToolbarLayoutWorkaround(coordinatorLayout, config, appBar)
            appBar.toolbar.requestLayout()
        } else {
            removeContentBehavior(coordinatorLayout)
            coordinatorLayout.requestLayout()
        }

        cacheRebuildTriggers(config)
    }

    private fun teardown(coordinatorLayout: StackHeaderCoordinatorLayout) {
        detachSubviews()
        appBarLayout?.let {
            detachAppBarListeners(it)
            coordinatorLayout.removeView(it)
        }
        appBarLayout = null
        managedTitleView = null
        lastBackButtonVisible = null
        lastBackButtonTintColor = null
        lastBackButtonIcon = null
        lastScrollFlags = null
        clearCachedRebuildTriggers()
    }

    private fun cacheRebuildTriggers(config: StackHeaderConfigProviding) {
        lastHeaderType = config.type
        lastHidden = config.hidden
        lastTransparent = config.transparent
        attachedLeadingSubview = config.leadingSubview
        attachedCenterSubview = config.centerSubview
        attachedTrailingSubview = config.trailingSubview
        attachedBackgroundSubview = config.backgroundSubview
        lastBackgroundSubviewCollapseMode = config.backgroundSubview?.collapseMode
    }

    private fun clearCachedRebuildTriggers() {
        lastHeaderType = null
        lastHidden = false
        lastTransparent = false
        attachedLeadingSubview = null
        attachedCenterSubview = null
        attachedTrailingSubview = null
        attachedBackgroundSubview = null
        lastBackgroundSubviewCollapseMode = null
    }

    private fun detachSubviews() {
        val appBar = appBarLayout ?: return

        attachedLeadingSubview?.let { appBar.toolbar.removeView(it.view) }
        attachedCenterSubview?.let { appBar.toolbar.removeView(it.view) }
        attachedTrailingSubview?.let { appBar.toolbar.removeView(it.view) }

        if (appBar is StackHeaderAppBarLayout.Collapsing) {
            attachedBackgroundSubview?.let {
                val wrapper = it.view.parent as? FrameLayout ?: return@let
                wrapper.removeView(it.view)
                appBar.collapsingToolbarLayout.removeView(wrapper)
            }
        }
    }

    // endregion

    // region App bar population

    private fun populateAppBar(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigProviding,
    ) {
        val toolbar = appBar.toolbar

        // Toolbar measures children in insertion order. Leading and trailing go first so the
        // title/center gets the remaining space.
        config.leadingSubview?.let {
            it.view.detachFromCurrentParent()
            toolbar.addView(it.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.START))
        }

        config.trailingSubview?.let {
            it.view.detachFromCurrentParent()
            toolbar.addView(it.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.END))
        }

        populateTitleOrCenter(appBar, toolbar, config)
        populateBackground(appBar, config)
    }

    private fun populateTitleOrCenter(
        appBar: StackHeaderAppBarLayout,
        toolbar: Toolbar,
        config: StackHeaderConfigProviding,
    ) {
        val centerSubview = config.centerSubview
        if (centerSubview != null) {
            if (appBar is StackHeaderAppBarLayout.Small) {
                toolbar.removeView(managedTitleView)
                managedTitleView = null

                centerSubview.view.detachFromCurrentParent()
                toolbar.addView(centerSubview.view, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.CENTER_HORIZONTAL))
            } else {
                Log.e(TAG, "[RNScreens] Center subview is supported only for small header type.")
            }
        } else if (appBar is StackHeaderAppBarLayout.Small) {
            // Small header needs a managed title view because we can't use
            // Toolbar's native title - it would be laid out to the leading side of leading subview.
            val titleView = createManagedTitleView(toolbar)
            managedTitleView = titleView
            val index = if (config.isRTL) 0 else -1
            toolbar.addView(titleView, index, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.START))
        }
    }

    private fun populateBackground(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigProviding,
    ) {
        val backgroundSubview = config.backgroundSubview ?: return

        if (appBar !is StackHeaderAppBarLayout.Collapsing) {
            Log.e(TAG, "[RNScreens] Background subview is supported only for collapsing header types (medium, large).")
            return
        }

        // Wrap in a FrameLayout so that CollapsingToolbarLayout's ViewOffsetHelper
        // attaches to the disposable wrapper, not the reused React view. This avoids
        // stale parallax offsets persisting across collapse mode rebuilds therefore allowing
        // runtime changes to this property.
        backgroundSubview.view.detachFromCurrentParent()
        val wrapper =
            FrameLayout(appBar.context).apply {
                // We're setting `fitsSystemWindows` so that the background renders behind status bar (edge-to-edge).
                fitsSystemWindows = true
                addView(backgroundSubview.view, FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT))
            }

        appBar.collapsingToolbarLayout.addView(
            wrapper,
            0,
            CollapsingToolbarLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT).apply {
                collapseMode = backgroundSubview.collapseMode.toNativeCollapseMode()
            },
        )
    }

    private fun createManagedTitleView(toolbar: Toolbar): AppCompatTextView =
        AppCompatTextView(toolbar.context).apply {
            setSingleLine()
            ellipsize = TextUtils.TruncateAt.END
            TextViewCompat.setTextAppearance(
                this,
                R.style.TextAppearance_Material3_TitleLarge,
            )
            layoutParams =
                Toolbar
                    .LayoutParams(
                        Toolbar.LayoutParams.WRAP_CONTENT,
                        Toolbar.LayoutParams.WRAP_CONTENT,
                        Gravity.START,
                    ).apply {
                        // TODO: there seems to be a problem with collapsing margins.
                        //       We will expose customization either way but we should
                        //       have consistent behavior and defaults.
                        marginStart = toolbar.titleMarginStart + toolbar.contentInsetStart
                        marginEnd = toolbar.titleMarginEnd
                        topMargin = toolbar.titleMarginTop
                        bottomMargin = toolbar.titleMarginBottom
                    }
        }

    // endregion

    // region In-place prop updates (no rebuild)

    private fun applyProps(config: StackHeaderConfigProviding) {
        val appBar = appBarLayout ?: return

        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                managedTitleView?.text = config.title
                managedTitleView?.requestLayout()
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                appBar.collapsingToolbarLayout.title = config.title
                applyBackgroundCollapseMode(config)
            }
        }

        applyScrollFlags(appBar, config)
        applyBackButton(appBar.toolbar, config)
    }

    private fun applyBackgroundCollapseMode(config: StackHeaderConfigProviding) {
        val backgroundSubview = config.backgroundSubview ?: return
        val wrapper = backgroundSubview.view.parent as? FrameLayout ?: return
        val params = wrapper.layoutParams as? CollapsingToolbarLayout.LayoutParams ?: return
        val desired = backgroundSubview.collapseMode.toNativeCollapseMode()
        if (params.collapseMode != desired) {
            params.collapseMode = desired
        }
    }

    private fun applyScrollFlags(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigProviding,
    ) {
        val desired = computeScrollFlags(config)

        if (desired == lastScrollFlags) return
        lastScrollFlags = desired

        warnInvalidScrollFlagCombinations(config)

        val target: View =
            when (appBar) {
                is StackHeaderAppBarLayout.Small -> appBar.toolbar
                is StackHeaderAppBarLayout.Collapsing -> appBar.collapsingToolbarLayout
            }
        val params = target.layoutParams as AppBarLayout.LayoutParams
        params.scrollFlags = desired
        target.layoutParams = params
        // Snap back to expanded so the visible state matches the new flags.
        appBar.setExpanded(true, false)
    }

    private fun computeScrollFlags(config: StackHeaderConfigProviding): Int {
        var flags = 0
        if (config.scrollFlagScroll) flags = flags or SCROLL_FLAG_SCROLL
        if (config.scrollFlagEnterAlways) flags = flags or SCROLL_FLAG_ENTER_ALWAYS
        if (config.scrollFlagEnterAlwaysCollapsed) flags = flags or SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED
        if (config.scrollFlagExitUntilCollapsed) flags = flags or SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
        if (config.scrollFlagSnap) flags = flags or SCROLL_FLAG_SNAP
        return flags
    }

    private fun warnInvalidScrollFlagCombinations(config: StackHeaderConfigProviding) {
        val anyDependentFlag =
            config.scrollFlagEnterAlways ||
                config.scrollFlagEnterAlwaysCollapsed ||
                config.scrollFlagExitUntilCollapsed ||
                config.scrollFlagSnap
        if (anyDependentFlag && !config.scrollFlagScroll) {
            Log.e(TAG, "[RNScreens] scrollFlag* requires scrollFlagScroll to take effect.")
        }
        if (config.scrollFlagEnterAlwaysCollapsed && !config.scrollFlagEnterAlways) {
            Log.e(TAG, "[RNScreens] scrollFlagEnterAlwaysCollapsed requires scrollFlagEnterAlways to take effect.")
        }
    }

    // endregion

    // region Back button

    private fun applyBackButton(
        toolbar: MaterialToolbar,
        config: StackHeaderConfigProviding,
    ) {
        val visible = canNavigateBack && !config.backButtonHidden
        val visibilityChanged = visible != lastBackButtonVisible
        val iconChanged = config.backButtonIcon !== lastBackButtonIcon
        val tintChanged = config.backButtonTintColor != lastBackButtonTintColor

        if (!visibilityChanged && !iconChanged && !tintChanged) return

        lastBackButtonVisible = visible
        lastBackButtonIcon = config.backButtonIcon
        lastBackButtonTintColor = config.backButtonTintColor

        if (!visible) {
            toolbar.navigationIcon = null
            toolbar.setNavigationOnClickListener(null)
            return
        }

        // Clear previous tint before setting icon to ensure clean state
        toolbar.clearNavigationIconTint()

        toolbar.navigationIcon = config.backButtonIcon ?: resolveDefaultBackButtonIcon()

        config.backButtonTintColor?.let {
            toolbar.setNavigationIconTint(it)
        }

        toolbar.setNavigationOnClickListener { onNavigationIconClick() }
    }

    // endregion

    // region Content behavior

    private fun setContentBehavior(coordinatorLayout: StackHeaderCoordinatorLayout) {
        val params = coordinatorLayout.stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        if (params.behavior == null) {
            params.behavior =
                StackHeaderScrollingViewBehavior { contentTop, _ ->
                    onHeaderHeightChanged(contentTop)
                }
            coordinatorLayout.stackScreenWrapper.layoutParams = params
            coordinatorLayout.stackScreenWrapper.requestLayout()
        }
    }

    private fun removeContentBehavior(coordinatorLayout: StackHeaderCoordinatorLayout) {
        val params = coordinatorLayout.stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        if (params.behavior != null) {
            params.behavior = null
            coordinatorLayout.stackScreenWrapper.layoutParams = params
            onHeaderHeightChanged(0)
            coordinatorLayout.stackScreenWrapper.requestLayout()
        }
    }

    // endregion

    // region Shadow state synchronization
    //
    // Shadow state (header frame + subview offsets) must be kept in sync with Yoga.
    // For non-transparent headers the ScrollingViewBehavior drives content positioning,
    // but shadow state is always driven by these two AppBarLayout listeners which cover
    // all change scenarios:
    // - OnOffsetChangedListener: fires when the appbar's scroll offset changes
    // - OnLayoutChangeListener: fires when the appbar's bounds change (e.g. size change)

    private val appBarOffsetListener =
        AppBarLayout.OnOffsetChangedListener { _, _ ->
            syncShadowState()
        }

    private val appBarLayoutChangeListener =
        View.OnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            syncShadowState()
        }

    private fun attachAppBarListeners(appBar: StackHeaderAppBarLayout) {
        appBar.addOnOffsetChangedListener(appBarOffsetListener)
        appBar.addOnLayoutChangeListener(appBarLayoutChangeListener)
    }

    private fun detachAppBarListeners(appBar: StackHeaderAppBarLayout) {
        appBar.removeOnOffsetChangedListener(appBarOffsetListener)
        appBar.removeOnLayoutChangeListener(appBarLayoutChangeListener)
    }

    /**
     * Synchronizes the header config and subview shadow state with the current
     * native layout. Called from both [appBarOffsetListener] and [appBarLayoutChangeListener].
     */
    private fun syncShadowState() {
        val config = currentConfig ?: return
        val appBar = appBarLayout ?: return

        // When config is transparent, the StackScreen is static so we need to offset the header
        // config by the offset of the AppBarLayout (which is 0 or is negative). When config is
        // opaque, the Screen always moves with the config, that's why we need to offset the header
        // config by the negative value of AppBarLayout's height.
        val configOffset = if (config.transparent) appBar.top else appBar.top - appBar.bottom

        config.updateHeaderFrame(
            width = appBar.width,
            height = appBar.height,
            contentOffsetY = configOffset,
        )

        updateSubviewOffsets(appBar, config)
    }

    private fun updateSubviewOffsets(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigProviding,
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

        subview.updateContentOriginOffset(
            x = subviewPos[0] - appBarPos[0],
            y = subviewPos[1] - appBarPos[1],
        )
    }

    // endregion

    private fun maybeApplyRTLCollapsingToolbarLayoutWorkaround(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigProviding,
        appBar: StackHeaderAppBarLayout,
    ) {
        // For collapsing headers, CTL lazily adds a MATCH_PARENT dummy view
        // to the Toolbar during the first onMeasure (ensureToolbar). We need
        // our subviews at higher indices than the dummy view so they get
        // positioned first in RTL layout. Forcing a measure triggers the
        // dummy view creation.
        if (appBar is StackHeaderAppBarLayout.Collapsing && config.isRTL) {
            appBar.measure(
                View.MeasureSpec.makeMeasureSpec(coordinatorLayout.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
            )
            moveDummyViewToFront(appBar.toolbar)
        }
    }

    /**
     * CollapsingToolbarLayout adds a MATCH_PARENT dummy view to the Toolbar
     * for title bounds tracking. In RTL, the Toolbar iterates custom views
     * in reverse child order - so the dummy view (if last) gets processed
     * first and consumes the entire layout cursor. Moving it to index 0
     * ensures our subviews are processed first.
     *
     * See https://github.com/material-components/material-components-android/issues/1867.
     */
    private fun moveDummyViewToFront(toolbar: Toolbar) {
        for (i in 0 until toolbar.childCount) {
            val child = toolbar.getChildAt(i)
            // Assumes only StackHeaderSubview children exist in Collapsing toolbar besides
            // the CTL dummy view.
            if (child !is StackHeaderSubview) {
                val lp = child.layoutParams
                toolbar.removeViewAt(i)
                toolbar.addView(child, 0, lp)
                return
            }
        }
    }

    private fun resolveDefaultBackButtonIcon(): Drawable? = resolveDrawableAttr(wrappedContext, androidx.appcompat.R.attr.homeAsUpIndicator)

    companion object {
        private const val TAG = "StackHeaderCoordinator"
    }
}
