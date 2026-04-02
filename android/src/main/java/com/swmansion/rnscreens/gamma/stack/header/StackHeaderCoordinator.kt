package com.swmansion.rnscreens.gamma.stack.header

import android.content.Context
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
import com.google.android.material.appbar.CollapsingToolbarLayout
import com.swmansion.rnscreens.ext.detachFromCurrentParent
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfigProviding
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderType
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
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
    private var lastLeadingSubviewWidth: Int? = null
    private var lastTrailingSubviewWidth: Int? = null
    private var lastBackgroundSubviewCollapseMode: StackHeaderSubviewCollapseMode? = null

    // For small header, we need to use custom title view in order to
    // render a subview to the leading side of the title.
    private var managedTitleView: AppCompatTextView? = null

    private var shouldRequestLayout = false

    internal fun applyHeaderConfig(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigProviding?,
    ) {
        shouldRequestLayout = false

        currentConfig = config
        if (config != null) {
            updateHeader(coordinatorLayout, config)
        } else {
            removeHeader(coordinatorLayout)
        }

        if (shouldRequestLayout) {
            coordinatorLayout.maybeRequestLayoutContainer()
            shouldRequestLayout = false
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
        shouldRequestLayout = true
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
            if (config.leadingSubview?.view?.width != lastLeadingSubviewWidth) return true
            if (config.trailingSubview?.view?.width != lastTrailingSubviewWidth) return true
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

            appBar.requestApplyInsets()
            maybeApplyRtlCollapsingToolbarLayoutWorkaround(coordinatorLayout, config, appBar)
            populateAppBar(appBar, config)
        } else {
            removeContentBehavior(coordinatorLayout)
        }

        cacheRebuildTriggers(config)
        shouldRequestLayout = true
    }

    private fun teardown(coordinatorLayout: StackHeaderCoordinatorLayout) {
        detachSubviews()
        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout = null
        managedTitleView = null
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
        lastLeadingSubviewWidth = config.leadingSubview?.view?.width
        lastTrailingSubviewWidth = config.trailingSubview?.view?.width
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
        lastLeadingSubviewWidth = null
        lastTrailingSubviewWidth = null
        lastBackgroundSubviewCollapseMode = null
    }

    private fun detachSubviews() {
        val appBar = appBarLayout ?: return

        attachedLeadingSubview?.let { unwrapAndRemoveFrom(it, appBar.toolbar) }
        attachedCenterSubview?.let { unwrapAndRemoveFrom(it, appBar.toolbar) }
        attachedTrailingSubview?.let { unwrapAndRemoveFrom(it, appBar.toolbar) }

        if (appBar is StackHeaderAppBarLayout.Collapsing) {
            attachedBackgroundSubview?.let {
                unwrapAndRemoveFrom(it, appBar.collapsingToolbarLayout)
            }
        }
    }

    // endregion

    // region Subview wrapping
    //
    // All subviews are wrapped in a FrameLayout before being added to the
    // toolbar or collapsing toolbar layout. This ensures the React view has
    // a relative offset of (0,0) within its native parent, matching what
    // Yoga expects (it always thinks views are at origin).

    private fun wrapSubview(
        subview: StackHeaderSubviewProviding,
        context: Context,
        wrapperWidth: Int = WRAP_CONTENT,
        wrapperHeight: Int = WRAP_CONTENT,
    ): FrameLayout {
        subview.view.detachFromCurrentParent()
        return FrameLayout(context).apply {
            addView(subview.view, FrameLayout.LayoutParams(wrapperWidth, wrapperHeight))
        }
    }

    private fun unwrapAndRemoveFrom(
        subview: StackHeaderSubviewProviding,
        parent: android.view.ViewGroup,
    ) {
        val wrapper = subview.view.parent as? FrameLayout ?: return
        wrapper.removeView(subview.view)
        parent.removeView(wrapper)
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
            val wrapper = wrapSubview(it, toolbar.context)
            toolbar.addView(wrapper, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.START))
        }

        config.trailingSubview?.let {
            val wrapper = wrapSubview(it, toolbar.context)
            toolbar.addView(wrapper, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.END))
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

                val wrapper = wrapSubview(centerSubview, toolbar.context)
                toolbar.addView(wrapper, Toolbar.LayoutParams(WRAP_CONTENT, WRAP_CONTENT, Gravity.CENTER_HORIZONTAL))
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
        val wrapper =
            wrapSubview(backgroundSubview, appBar.context, MATCH_PARENT, MATCH_PARENT).apply {
                // We're setting `fitsSystemWindows` so that the background renders behind status bar (edge-to-edge).
                fitsSystemWindows = true
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

                // Changing small title requires layout
                shouldRequestLayout = true
            }

            is StackHeaderAppBarLayout.Collapsing -> {
                appBar.collapsingToolbarLayout.title = config.title
                applyBackgroundCollapseMode(config)
            }
        }
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

    // endregion

    // region Content behavior

    private fun setContentBehavior(coordinatorLayout: StackHeaderCoordinatorLayout) {
        val params = coordinatorLayout.stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        if (params.behavior == null) {
            params.behavior =
                StackHeaderScrollingViewBehavior { contentTop, dependency ->
                    onHeaderHeightChanged(contentTop)
                    updateShadowState(contentTop, dependency)
                }
            coordinatorLayout.stackScreenWrapper.layoutParams = params
            shouldRequestLayout = true
        }
    }

    private fun removeContentBehavior(coordinatorLayout: StackHeaderCoordinatorLayout) {
        val params = coordinatorLayout.stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        if (params.behavior != null) {
            params.behavior = null
            coordinatorLayout.stackScreenWrapper.layoutParams = params
            onHeaderHeightChanged(0)
            shouldRequestLayout = true
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

        // For header config we need to:
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

    private fun maybeApplyRtlCollapsingToolbarLayoutWorkaround(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigProviding,
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
