package com.swmansion.rnscreens.gamma.stack.header

import android.content.Context
import android.text.TextUtils
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.AppCompatTextView
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.TextViewCompat
import com.google.android.material.R
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.swmansion.rnscreens.ext.detachFromCurrentParent
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderType
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewProviding

internal class StackHeaderCoordinator(
    context: Context,
    private val onHeaderHeightChanged: (headerHeight: Int) -> Unit,
) {
    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    private var appBarLayout: StackHeaderAppBarLayout? = null
    private var currentHeaderTypeOrNull: StackHeaderType? = null
    private var currentConfig: StackHeaderConfigurationProviding? = null

    private var attachedLeadingSubview: StackHeaderSubviewProviding? = null
    private var attachedCenterSubview: StackHeaderSubviewProviding? = null
    private var attachedTrailingSubview: StackHeaderSubviewProviding? = null
    private var attachedBackgroundSubview: StackHeaderSubviewProviding? = null

    // Width snapshots for collapsing header rebuild detection.
    // CollapsingToolbarLayout can't resize custom views at runtime,
    // so we must rebuild the hierarchy when toolbar subview widths change.
    private var lastLeadingSubviewWidth: Int? = null
    private var lastTrailingSubviewWidth: Int? = null

    // For small header, we need to use custom title view in order to
    // render a subview to the leading side of the title.
    private var managedTitleView: AppCompatTextView? = null

    internal fun applyHeaderConfiguration(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding?,
    ) {
        currentConfig = config
        if (config != null) {
            updateHeader(coordinatorLayout, config)
        } else {
            removeHeader(coordinatorLayout)
        }
        coordinatorLayout.maybeRequestLayoutContainer()
    }

    private fun updateHeader(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        if (requiresRebuild(config)) {
            rebuild(coordinatorLayout, config)
        }
        applyProps(config)
        applyContentBehavior(coordinatorLayout, config)
    }

    private fun removeHeader(coordinatorLayout: StackHeaderCoordinatorLayout) {
        teardown(coordinatorLayout)
        removeContentBehavior(coordinatorLayout)
    }

    // region Rebuild detection

    private fun requiresRebuild(config: StackHeaderConfigurationProviding): Boolean {
        val desiredTypeOrNull = if (config.hidden) null else config.type
        if (desiredTypeOrNull != currentHeaderTypeOrNull) return true
        if (config.leadingSubview !== attachedLeadingSubview) return true
        if (config.centerSubview !== attachedCenterSubview) return true
        if (config.trailingSubview !== attachedTrailingSubview) return true
        if (config.backgroundSubview !== attachedBackgroundSubview) return true

        if (appBarLayout is StackHeaderAppBarLayout.Collapsing) {
            if (config.leadingSubview?.view?.width != lastLeadingSubviewWidth) return true
            if (config.trailingSubview?.view?.width != lastTrailingSubviewWidth) return true
        }

        return false
    }

    private fun snapshotSubviewWidths(config: StackHeaderConfigurationProviding) {
        lastLeadingSubviewWidth = config.leadingSubview?.view?.width
        lastTrailingSubviewWidth = config.trailingSubview?.view?.width
    }

    // endregion

    // region Full rebuild

    private fun rebuild(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        teardown(coordinatorLayout)

        val desiredTypeOrNull = if (config.hidden) null else config.type

        if (desiredTypeOrNull != null) {
            val appBar = StackHeaderAppBarLayout.create(wrappedContext, desiredTypeOrNull)
            appBarLayout = appBar
            coordinatorLayout.addView(appBar, 0)
            appBar.requestApplyInsets()

            maybeApplyRtlCollapsingToolbarLayoutWorkaround(coordinatorLayout, config, appBar)

            populateAppBar(appBar, config)
        }

        currentHeaderTypeOrNull = desiredTypeOrNull
        attachedLeadingSubview = config.leadingSubview
        attachedCenterSubview = config.centerSubview
        attachedTrailingSubview = config.trailingSubview
        attachedBackgroundSubview = config.backgroundSubview
        snapshotSubviewWidths(config)
    }

    private fun teardown(coordinatorLayout: StackHeaderCoordinatorLayout) {
        detachSubviews()
        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout = null
        managedTitleView = null
        currentHeaderTypeOrNull = null
        attachedLeadingSubview = null
        attachedCenterSubview = null
        attachedTrailingSubview = null
        attachedBackgroundSubview = null
    }

    private fun detachSubviews() {
        val appBar = appBarLayout ?: return

        attachedLeadingSubview?.let { appBar.toolbar.removeView(it.view) }
        attachedCenterSubview?.let { appBar.toolbar.removeView(it.view) }
        attachedTrailingSubview?.let { appBar.toolbar.removeView(it.view) }

        if (appBar is StackHeaderAppBarLayout.Collapsing) {
            attachedBackgroundSubview?.let { appBar.collapsingToolbarLayout.removeView(it.view) }
        }
    }

    // endregion

    // region App bar population

    private fun populateAppBar(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
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
        config: StackHeaderConfigurationProviding,
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
            toolbar.addView(titleView)
        }
    }

    private fun populateBackground(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val backgroundSubview = config.backgroundSubview ?: return

        if (appBar !is StackHeaderAppBarLayout.Collapsing) {
            Log.e(TAG, "[RNScreens] Background subview is supported only for collapsing header types (medium, large).")
            return
        }

        backgroundSubview.view.detachFromCurrentParent()

        // Needed to extend the background under the status bar
        backgroundSubview.view.fitsSystemWindows = true

        appBar.collapsingToolbarLayout.addView(
            backgroundSubview.view,
            0,
            CollapsingToolbarLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT),
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

    private fun applyProps(config: StackHeaderConfigurationProviding) {
        val appBar = appBarLayout ?: return

        when (appBar) {
            is StackHeaderAppBarLayout.Small -> {
                managedTitleView?.text = config.title
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                appBar.collapsingToolbarLayout.title = config.title
                applyBackgroundCollapseMode(config)
            }
        }
    }

    private fun applyBackgroundCollapseMode(config: StackHeaderConfigurationProviding) {
        val backgroundSubview = config.backgroundSubview ?: return
        val params = backgroundSubview.view.layoutParams as? CollapsingToolbarLayout.LayoutParams ?: return
        val desired = backgroundSubview.collapseMode.toNativeCollapseMode()
        if (params.collapseMode != desired) {
            params.collapseMode = desired
        }
    }

    // endregion

    // region Content behavior

    private fun applyContentBehavior(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val needsBehavior = appBarLayout != null && !config.transparent && !config.hidden
        if (needsBehavior) {
            setContentBehavior(coordinatorLayout)
        } else {
            removeContentBehavior(coordinatorLayout)
        }
    }

    private fun setContentBehavior(coordinatorLayout: StackHeaderCoordinatorLayout) {
        val params = coordinatorLayout.stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        if (params.behavior == null) {
            params.behavior =
                StackHeaderScrollingViewBehavior { contentTop, dependency ->
                    onHeaderHeightChanged(contentTop)
                    updateShadowState(contentTop, dependency)
                }
            coordinatorLayout.stackScreenWrapper.layoutParams = params
        }
    }

    private fun removeContentBehavior(coordinatorLayout: StackHeaderCoordinatorLayout) {
        val params = coordinatorLayout.stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        if (params.behavior != null) {
            params.behavior = null
            coordinatorLayout.stackScreenWrapper.layoutParams = params
            onHeaderHeightChanged(0)
        }
    }

    // endregion

    // region Shadow state updates (Yoga synchronization)

    /**
     * Called on every AppBarLayout change (scroll, size, position) via
     * [StackHeaderScrollingViewBehavior.onDependentViewChanged].
     *
     * @param contentTop Y position of the content area (StackScreen wrapper) in the CoordinatorLayout
     * @param dependency the AppBarLayout view
     */
    private fun updateShadowState(
        contentTop: Int,
        dependency: View,
    ) {
        val config = currentConfig ?: return
        val appBar = appBarLayout ?: return

        // For header configuration we need to:
        // - cancel out the StackScreen's Y offset (contentTop),
        // - handle AppBarLayout's negative offset when collapsed.
        config.updateHeaderFrame(
            width = appBar.width,
            height = appBar.height,
            contentOffsetY = appBar.top - contentTop,
        )

        // For subviews report position relative to AppBarLayout
        updateSubviewOffsets(appBar, config)
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

        subview.updateContentOriginOffset(
            x = subviewPos[0] - appBarPos[0],
            y = subviewPos[1] - appBarPos[1],
        )
    }

    // endregion

    private fun maybeApplyRtlCollapsingToolbarLayoutWorkaround(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
        appBar: StackHeaderAppBarLayout,
    ) {
        // For collapsing headers, CTL lazily adds a MATCH_PARENT dummy view
        // to the Toolbar during the first onMeasure (ensureToolbar). We need
        // our subviews at higher indices than the dummy view so they get
        // positioned first in RTL layout. Forcing a measure triggers the
        // dummy view creation.
        if (appBar is StackHeaderAppBarLayout.Collapsing && config.isRtl) {
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
            if (child !is StackHeaderSubview) {
                val lp = child.layoutParams
                toolbar.removeViewAt(i)
                toolbar.addView(child, 0, lp)
                return
            }
        }
    }

    companion object {
        private const val TAG = "StackHeaderCoordinator"
    }
}
