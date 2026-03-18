package com.swmansion.rnscreens.gamma.stack.header

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.MenuItem
import android.view.View
import androidx.appcompat.view.ContextThemeWrapper
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.R
import com.google.android.material.appbar.MaterialToolbar
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.header.configuration.StackHeaderType

internal class StackHeaderCoordinator(
    context: Context,
    private val onHeaderHeightChanged: (headerHeight: Int) -> Unit,
) {
    private var appBarLayout: StackHeaderAppBarLayout? = null
    private var currentHeaderType: StackHeaderType? = null

    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    internal fun applyHeaderConfiguration(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        applyStructure(coordinatorLayout, config)
        applyAppBarConfiguration(config, coordinatorLayout)
        applyContentBehavior(coordinatorLayout, config)
        coordinatorLayout.maybeRequestLayoutContainer()
    }

    private fun applyStructure(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val desiredType = if (config.isHidden) null else config.headerType

        if (desiredType == currentHeaderType) return

        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout =
            desiredType?.let {
                StackHeaderAppBarLayout.create(wrappedContext, it).also { appBar ->
                    coordinatorLayout.addView(appBar, 0)
                }
            }

        currentHeaderType = desiredType
    }

    private fun applyAppBarConfiguration(config: StackHeaderConfigurationProviding, coordinatorLayout: StackHeaderCoordinatorLayout) {
        appBarLayout?.let { appBar ->
            applyTitle(appBar, config.title)
            // TODO: other app bar configuration...
            applyDebugToolbarItems(appBar.toolbar, coordinatorLayout)
        }
    }

    // region DEBUG — remove later
    private var debugItemsApplied = false

    private fun applyDebugToolbarItems(toolbar: MaterialToolbar, coordinatorLayout: StackHeaderCoordinatorLayout) {
        if (debugItemsApplied) return
        debugItemsApplied = true

        // Navigation icon (back arrow)
        toolbar.setNavigationIcon(androidx.appcompat.R.drawable.abc_ic_ab_back_material)
        toolbar.setNavigationOnClickListener { /* no-op for now */ }

        val density = toolbar.context.resources.displayMetrics.density

        // Custom views and menu items added with delay to test runtime insertion
        toolbar.postDelayed({
            // Custom view on the left side (red box, 48x48dp)
            val customView = View(toolbar.context).apply {
                setBackgroundColor(Color.RED)
                layoutParams = Toolbar.LayoutParams(
                    (48 * density).toInt(),
                    (48 * density).toInt(),
                    Gravity.START,
                )
            }
            toolbar.addView(customView, 0)
            coordinatorLayout.maybeRequestLayoutContainer()
        }, 3000)

        toolbar.postDelayed({
            // Custom view on the right side (green box, 48x48dp)
            val customView2 = View(toolbar.context).apply {
                setBackgroundColor(Color.GREEN)
                layoutParams = Toolbar.LayoutParams(
                    (48 * density).toInt(),
                    (48 * density).toInt(),
                    Gravity.END,
                )
            }
            toolbar.addView(customView2, 2)
            coordinatorLayout.maybeRequestLayoutContainer()
        }, 5000)

        toolbar.postDelayed({
            // Menu items: one always visible, two in overflow
            toolbar.menu.apply {
                add(0, 1, 0, "Search").apply {
                    setIcon(android.R.drawable.ic_menu_search)
                    setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS)
                }
                add(0, 2, 1, "Settings").apply {
                    setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER)
                }
                add(0, 3, 2, "About").apply {
                    setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER)
                }
            }
            coordinatorLayout.maybeRequestLayoutContainer()
        }, 7000)
    }
    // endregion

    private fun applyTitle(
        appBarLayout: StackHeaderAppBarLayout,
        title: String,
    ) {
        // TODO: diffing mechanism?
        when (appBarLayout) {
            is StackHeaderAppBarLayout.Small -> {
                appBarLayout.toolbar.title = title
            }
            is StackHeaderAppBarLayout.Collapsing -> {
                appBarLayout.toolbar.title = null
                appBarLayout.collapsingToolbarLayout.title = title
            }
        }
    }

    private fun applyContentBehavior(
        coordinatorLayout: StackHeaderCoordinatorLayout,
        config: StackHeaderConfigurationProviding,
    ) {
        val stackScreenWrapper = coordinatorLayout.stackScreenWrapper
        val params = stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        val needsBehavior = appBarLayout != null && !config.isTransparent && !config.isHidden
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
