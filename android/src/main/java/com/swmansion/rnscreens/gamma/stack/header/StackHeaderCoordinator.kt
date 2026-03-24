package com.swmansion.rnscreens.gamma.stack.header

import android.content.Context
import android.text.TextUtils
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.AppCompatTextView
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.TextViewCompat
import com.google.android.material.R
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderType
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewCollapseMode
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

    private var attachedLeftSubview: StackHeaderSubviewProviding? = null
    private var attachedCenterSubview: StackHeaderSubviewProviding? = null
    private var attachedRightSubview: StackHeaderSubviewProviding? = null
    private var attachedBackgroundSubview: StackHeaderSubviewProviding? = null

    // Width snapshots for collapsing header rebuild detection.
    // CollapsingToolbarLayout can't resize custom views at runtime,
    // so we must rebuild the hierarchy when toolbar subview widths change.
    private var lastLeftSubviewWidth: Int? = null
    private var lastCenterSubviewWidth: Int? = null
    private var lastRightSubviewWidth: Int? = null

    // For small header, we need to use custom title view in order to
    // render a subview to the left of the title.
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
        if (config.leftSubview !== attachedLeftSubview) return true
        if (config.centerSubview !== attachedCenterSubview) return true
        if (config.rightSubview !== attachedRightSubview) return true
        if (config.backgroundSubview !== attachedBackgroundSubview) return true

        if (appBarLayout is StackHeaderAppBarLayout.Collapsing) {
            if (config.leftSubview?.view?.width != lastLeftSubviewWidth) return true
            if (config.rightSubview?.view?.width != lastRightSubviewWidth) return true
        }

        return false
    }

    private fun snapshotSubviewWidths(config: StackHeaderConfigurationProviding) {
        lastLeftSubviewWidth = config.leftSubview?.view?.width
        lastCenterSubviewWidth = config.centerSubview?.view?.width
        lastRightSubviewWidth = config.rightSubview?.view?.width
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
            populateAppBar(appBar, config)
            coordinatorLayout.addView(appBar, 0)
            appBar.requestApplyInsets()
        }

        currentHeaderTypeOrNull = desiredTypeOrNull
        attachedLeftSubview = config.leftSubview
        attachedCenterSubview = config.centerSubview
        attachedRightSubview = config.rightSubview
        attachedBackgroundSubview = config.backgroundSubview
        snapshotSubviewWidths(config)
    }

    private fun teardown(coordinatorLayout: StackHeaderCoordinatorLayout) {
        detachSubviews()
        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout = null
        managedTitleView = null
        currentHeaderTypeOrNull = null
        attachedLeftSubview = null
        attachedCenterSubview = null
        attachedRightSubview = null
        attachedBackgroundSubview = null
    }

    private fun detachSubviews() {
        val appBar = appBarLayout ?: return

        attachedLeftSubview?.let { appBar.toolbar.removeView(it.view) }
        attachedCenterSubview?.let { appBar.toolbar.removeView(it.view) }
        attachedRightSubview?.let { appBar.toolbar.removeView(it.view) }

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

        // Toolbar measures children in insertion order. Left and right go first so the
        // title/center gets the remaining space.
        config.leftSubview?.let {
            detachFromCurrentParent(it.view)
            toolbar.addView(it.view, startGravityParams())
        }

        config.rightSubview?.let {
            detachFromCurrentParent(it.view)
            toolbar.addView(it.view, endGravityParams())
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

                detachFromCurrentParent(centerSubview.view)

                toolbar.addView(centerSubview.view, centerGravityParams())
            } else {
                Log.e(TAG, "[RNScreens] Center subview is supported only for small header type.")
            }
        } else if (appBar is StackHeaderAppBarLayout.Small) {
            // Small header needs a managed title view because we can't use
            // Toolbar's native title - it would be laid out to the left of left subview.
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

        detachFromCurrentParent(backgroundSubview.view)

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
        val desired = toNativeCollapseMode(backgroundSubview.collapseMode)
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
        config.leftSubview?.let { updateSubviewOffset(it, appBar) }
        config.centerSubview?.let { updateSubviewOffset(it, appBar) }
        config.rightSubview?.let { updateSubviewOffset(it, appBar) }
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

    companion object {
        private const val TAG = "StackHeaderCoordinator"

        private fun detachFromCurrentParent(view: View) {
            (view.parent as? ViewGroup)?.removeView(view)
        }

        private fun startGravityParams() =
            Toolbar.LayoutParams(
                Toolbar.LayoutParams.WRAP_CONTENT,
                Toolbar.LayoutParams.WRAP_CONTENT,
                Gravity.START,
            )

        private fun centerGravityParams() =
            Toolbar.LayoutParams(
                Toolbar.LayoutParams.WRAP_CONTENT,
                Toolbar.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER_HORIZONTAL,
            )

        private fun endGravityParams() =
            Toolbar.LayoutParams(
                Toolbar.LayoutParams.WRAP_CONTENT,
                Toolbar.LayoutParams.WRAP_CONTENT,
                Gravity.END,
            )

        private fun toNativeCollapseMode(mode: StackHeaderSubviewCollapseMode): Int =
            when (mode) {
                StackHeaderSubviewCollapseMode.OFF -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_OFF
                StackHeaderSubviewCollapseMode.PARALLAX -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PARALLAX
            }
    }
}
