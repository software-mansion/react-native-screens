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
    private var appBarLayout: StackHeaderAppBarLayout? = null
    private var currentHeaderType: StackHeaderType? = null

    private var attachedLeftSubview: StackHeaderSubviewProviding? = null
    private var lastLeftSubviewWidth: Int? = null

    private var attachedCenterSubview: StackHeaderSubviewProviding? = null
    private var lastCenterSubviewWidth: Int? = null

    private var attachedRightSubview: StackHeaderSubviewProviding? = null
    private var lastRightSubviewWidth: Int? = null

    private var attachedBackgroundSubview: StackHeaderSubviewProviding? = null

    private var managedTitleView: AppCompatTextView? = null

    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    internal fun applyHeaderConfiguration(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        if (requiresRebuild(config)) {
            rebuild(coordinatorLayout, config)
        }
        applyProps(config)
        applyContentBehavior(coordinatorLayout, config)
        coordinatorLayout.maybeRequestLayoutContainer()
    }

    // --- Rebuild detection ---

    private fun requiresRebuild(config: StackHeaderConfigurationProviding): Boolean {
        val desiredType = if (config.hidden) null else config.type
        if (desiredType != currentHeaderType) return true
        if (config.leftSubview !== attachedLeftSubview) return true
        if (config.centerSubview !== attachedCenterSubview) return true
        if (config.rightSubview !== attachedRightSubview) return true
        if (config.backgroundSubview !== attachedBackgroundSubview) return true

        // Collapsing headers need rebuild when subview sizes change
        // (MDC limitation: can't change custom views at runtime in CollapsingToolbarLayout)
        if (appBarLayout is StackHeaderAppBarLayout.Collapsing) {
            if (subviewWidthChanged(config.leftSubview, lastLeftSubviewWidth)) return true
            if (subviewWidthChanged(config.rightSubview, lastRightSubviewWidth)) return true
        }

        return false
    }

    private fun subviewWidthChanged(
        subview: StackHeaderSubviewProviding?,
        lastSubviewWidth: Int?,
    ): Boolean {
        if (subview == null && lastSubviewWidth == null) return false
        if (subview == null || lastSubviewWidth == null) return true
        return subview.view.width != lastSubviewWidth
    }

    private fun snapshotSubviewWidths(config: StackHeaderConfigurationProviding) {
        lastLeftSubviewWidth = config.leftSubview?.view?.width
        lastCenterSubviewWidth = config.centerSubview?.view?.width
        lastRightSubviewWidth = config.rightSubview?.view?.width
    }

    // --- Full rebuild ---

    private fun rebuild(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        teardown(coordinatorLayout)

        val desiredType = if (config.hidden) null else config.type

        if (desiredType != null) {
            val appBar = StackHeaderAppBarLayout.create(wrappedContext, desiredType)
            appBarLayout = appBar
            populateToolbar(appBar, config)
            coordinatorLayout.addView(appBar, 0)
            appBar.requestApplyInsets()
        }

        currentHeaderType = desiredType
        attachedLeftSubview = config.leftSubview
        attachedCenterSubview = config.centerSubview
        attachedRightSubview = config.rightSubview
        attachedBackgroundSubview = config.backgroundSubview

        snapshotSubviewWidths(config)
    }

    private fun teardown(coordinatorLayout: StackHeaderCoordinatorLayout) {
        // Subviews need to be detached before removing the app bar,
        // otherwise they'd be destroyed with it
        detachSubviews()
        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout = null
        managedTitleView = null
        currentHeaderType = null
        attachedLeftSubview = null
        attachedCenterSubview = null
        attachedRightSubview = null
        attachedBackgroundSubview = null
    }

    private fun detachSubviews() {
        val appBar = appBarLayout ?: return
        val toolbar = appBar.toolbar

        attachedLeftSubview?.let { toolbar.removeView(it.view) }
        attachedCenterSubview?.let { toolbar.removeView(it.view) }
        attachedRightSubview?.let { toolbar.removeView(it.view) }

        if (appBar is StackHeaderAppBarLayout.Collapsing) {
            attachedBackgroundSubview?.let { appBar.collapsingToolbarLayout.removeView(it.view) }
        }
    }

    // --- Toolbar population (called during rebuild) ---

    private fun populateToolbar(
        appBar: StackHeaderAppBarLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val toolbar = appBar.toolbar

        // Never use native title — we manage our own
        toolbar.title = null

        // Order matters for measurement: left first, then right, then title/center last.
        // Toolbar measures children by index order. Title should be measured last
        // so it gets the remaining space after left and right are accounted for.

        config.leftSubview?.let {
            detachFromCurrentParent(it.view)
            toolbar.addView(it.view, startGravityParams())
        }

        config.rightSubview?.let {
            detachFromCurrentParent(it.view)
            toolbar.addView(it.view, endGravityParams())
        }

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
            // Small header: managed title view (we can't use native title
            // because we can't insert custom views before it)
            val titleView = createManagedTitleView(toolbar)
            managedTitleView = titleView
            toolbar.addView(titleView)
        }

        // Background subview goes into CollapsingToolbarLayout, behind the toolbar
        val backgroundSubview = config.backgroundSubview
        if (appBar is StackHeaderAppBarLayout.Collapsing && backgroundSubview != null) {
            detachFromCurrentParent(backgroundSubview.view)
            backgroundSubview.view.fitsSystemWindows = true
            appBar.collapsingToolbarLayout.addView(
                backgroundSubview.view,
                0,
                CollapsingToolbarLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT).apply {
                    collapseMode = toNativeCollapseMode(backgroundSubview.collapseMode)
                },
            )
        } else if (backgroundSubview != null) {
            Log.e(TAG, "[RNScreens] Background subview is supported only for collapsing header types (medium, large).")
        }
    }

    private fun createManagedTitleView(toolbar: Toolbar): AppCompatTextView =
        AppCompatTextView(toolbar.context).apply {
            // Matches configuration from Toolbar.java
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
                        // TODO: this seems to be a problem with collapsing margins.
                        //       We will expose customization either way but we should
                        //       have consistent behavior and defaults.
                        marginStart = toolbar.titleMarginStart + toolbar.contentInsetStart
                        marginEnd = toolbar.titleMarginEnd
                        topMargin = toolbar.titleMarginTop
                        bottomMargin = toolbar.titleMarginBottom
                    }
        }

    private fun detachFromCurrentParent(view: View?) {
        (view?.parent as? ViewGroup)?.removeView(view)
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

    // --- In-place prop updates (no rebuild needed) ---

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

    private fun applyBackgroundCollapseMode(
        config: StackHeaderConfigurationProviding,
    ) {
        val backgroundSubview = config.backgroundSubview ?: return
        val params = backgroundSubview.view.layoutParams as? CollapsingToolbarLayout.LayoutParams ?: return
        val desired = toNativeCollapseMode(backgroundSubview.collapseMode)
        if (params.collapseMode != desired) {
            params.collapseMode = desired
        }
    }

    // --- Collapse mode mapping ---

    private fun toNativeCollapseMode(mode: StackHeaderSubviewCollapseMode): Int =
        when (mode) {
            StackHeaderSubviewCollapseMode.OFF -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_OFF
            StackHeaderSubviewCollapseMode.PIN -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN
            StackHeaderSubviewCollapseMode.PARALLAX -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PARALLAX
        }

    // --- Content behavior ---

    private fun applyContentBehavior(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val stackScreenWrapper = coordinatorLayout.stackScreenWrapper
        val params = stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        val needsBehavior = appBarLayout != null && !config.transparent && !config.hidden
        val hasBehavior = params.behavior != null
        if (needsBehavior != hasBehavior) {
            params.behavior =
                if (needsBehavior) {
                    StackHeaderScrollingViewBehavior(onHeaderHeightChanged)
                } else {
                    onHeaderHeightChanged(0)
                    null
                }
            stackScreenWrapper.layoutParams = params
        }
    }

    companion object {
        const val TAG = "StackHeaderCoordinator"
    }
}
