package com.swmansion.rnscreens.gamma.stack.header

import android.content.Context
import android.text.TextUtils
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.AppCompatTextView
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.TextViewCompat
import com.google.android.material.R
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderType
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview

internal class StackHeaderCoordinator(
    context: Context,
    private val onHeaderHeightChanged: (headerHeight: Int) -> Unit,
) {
    private var appBarLayout: StackHeaderAppBarLayout? = null
    private var currentHeaderType: StackHeaderType? = null

    private var attachedLeftSubview: StackHeaderSubview? = null
    private var lastLeftSubviewWidth: Int? = null

    private var attachedCenterSubview: StackHeaderSubview? = null
    private var lastCenterSubviewWidth: Int? = null

    private var attachedRightSubview: StackHeaderSubview? = null
    private var lastRightSubviewWidth: Int? = null

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

        // Collapsing headers need rebuild when subview sizes change
        // (MDC limitation: can't change custom views at runtime in CollapsingToolbarLayout)
        if (appBarLayout is StackHeaderAppBarLayout.Collapsing) {
            if (subviewWidthChanged(config.leftSubview, lastLeftSubviewWidth)) return true
            if (subviewWidthChanged(config.centerSubview, lastCenterSubviewWidth)) return true
            if (subviewWidthChanged(config.rightSubview, lastRightSubviewWidth)) return true
        }

        return false
    }

    private fun subviewWidthChanged(
        subview: StackHeaderSubview?,
        lastSubviewWidth: Int?,
    ): Boolean {
        if (subview == null && lastSubviewWidth == null) return false
        if (subview == null || lastSubviewWidth == null) return true
        return subview.width != lastSubviewWidth
    }

    private fun snapshotSubviewWidths(config: StackHeaderConfigurationProviding) {
        lastLeftSubviewWidth = config.leftSubview?.width
        lastCenterSubviewWidth = config.centerSubview?.width
        lastRightSubviewWidth = config.rightSubview?.width
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
            populateToolbar(appBar.toolbar, config)
            coordinatorLayout.addView(appBar, 0)
        }

        currentHeaderType = desiredType
        attachedLeftSubview = config.leftSubview
        attachedCenterSubview = config.centerSubview
        attachedRightSubview = config.rightSubview

        snapshotSubviewWidths(config)
    }

    private fun teardown(coordinatorLayout: StackHeaderCoordinatorLayout) {
        // Subviews need to be detached from toolbar before removing the app bar,
        // otherwise they'd be destroyed with it
        detachSubviewsFromToolbar()
        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout = null
        managedTitleView = null
        currentHeaderType = null
        attachedLeftSubview = null
        attachedCenterSubview = null
        attachedRightSubview = null
    }

    private fun detachSubviewsFromToolbar() {
        val toolbar = appBarLayout?.toolbar ?: return
        attachedLeftSubview?.let { toolbar.removeView(it) }
        attachedCenterSubview?.let { toolbar.removeView(it) }
        attachedRightSubview?.let { toolbar.removeView(it) }
    }

    // --- Toolbar population (called during rebuild) ---

    private fun populateToolbar(
        toolbar: MaterialToolbar,
        config: StackHeaderConfigurationProviding,
    ) {
        // Never use native title — we manage our own
        toolbar.title = null

        // Order matters for measurement: left first, then right, then title/center last.
        // Toolbar measures children by index order. Title should be measured last
        // so it gets the remaining space after left and right are accounted for.

        config.leftSubview?.let {
            detachFromCurrentParent(it)
            toolbar.addView(it, startGravityParams())
        }

        config.rightSubview?.let {
            detachFromCurrentParent(it)
            toolbar.addView(it, endGravityParams())
        }

        if (config.centerSubview != null) {
            // Center subview replaces title for all header types
            managedTitleView = null
            detachFromCurrentParent(config.centerSubview)
            toolbar.addView(config.centerSubview, centerGravityParams())
        } else if (appBarLayout is StackHeaderAppBarLayout.Small) {
            // Small header: managed title view (we can't use native title
            // because we can't insert custom views before it)
            val titleView = createManagedTitleView(toolbar)
            managedTitleView = titleView
            toolbar.addView(titleView)
        }
        // Collapsing: no title in toolbar — CTL handles it (canvas-drawn)
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
                if (config.centerSubview != null) {
                    appBar.collapsingToolbarLayout.title = null
                } else {
                    appBar.collapsingToolbarLayout.title = config.title
                }
            }
        }
    }

    // --- Content behavior (unchanged) ---

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
}
