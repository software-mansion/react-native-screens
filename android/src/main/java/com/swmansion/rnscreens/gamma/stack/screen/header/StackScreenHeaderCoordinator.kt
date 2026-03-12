package com.swmansion.rnscreens.gamma.stack.screen.header

import android.content.Context
import androidx.appcompat.view.ContextThemeWrapper
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.R
import com.google.android.material.appbar.AppBarLayout
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderConfigurationProviding
import com.swmansion.rnscreens.gamma.stack.screen.header.configuration.StackScreenHeaderType

internal class StackScreenHeaderCoordinator(
    context: Context,
) {
    private var appBarLayout: StackScreenAppBarLayout? = null
    private var currentHeaderType: StackScreenHeaderType? = null

    private val wrappedContext =
        ContextThemeWrapper(
            context,
            R.style.Theme_Material3_DayNight_NoActionBar,
        )

    internal fun applyHeaderConfiguration(
        coordinatorLayout: StackScreenCoordinatorLayout,
        config: StackScreenHeaderConfigurationProviding,
    ) {
        applyStructure(coordinatorLayout, config)
        applyAppBarConfiguration(config)
        applyContentBehavior(coordinatorLayout, config)
        coordinatorLayout.maybeRequestLayoutContainer()
    }

    private fun applyStructure(
        coordinatorLayout: StackScreenCoordinatorLayout,
        config: StackScreenHeaderConfigurationProviding,
    ) {
        val desiredType = if (config.isHidden) null else config.headerType

        if (desiredType == currentHeaderType) return

        appBarLayout?.let { coordinatorLayout.removeView(it) }
        appBarLayout =
            desiredType?.let {
                StackScreenAppBarLayout.create(wrappedContext, it).also { appBar ->
                    coordinatorLayout.addView(appBar, 0)
                }
            }

        currentHeaderType = desiredType
    }

    private fun applyAppBarConfiguration(config: StackScreenHeaderConfigurationProviding) {
        appBarLayout?.let { appBar ->
            applyTitle(appBar, config.title)
            // ...
        }
    }

    private fun applyTitle(
        appBarLayout: StackScreenAppBarLayout,
        title: String,
    ) {
        when (appBarLayout) {
            is StackScreenAppBarLayout.Small -> {
                appBarLayout.toolbar.title = title
            }
            is StackScreenAppBarLayout.Collapsing -> {
                appBarLayout.toolbar.title = null
                appBarLayout.collapsingToolbarLayout.title = title
            }
        }
    }

    private fun applyContentBehavior(
        coordinatorLayout: StackScreenCoordinatorLayout,
        config: StackScreenHeaderConfigurationProviding,
    ) {
        val stackScreenWrapper = coordinatorLayout.stackScreenWrapper
        val params = stackScreenWrapper.layoutParams as CoordinatorLayout.LayoutParams
        val needsBehavior = appBarLayout != null && !config.isTransparent && !config.isHidden
        val hasBehavior = params.behavior != null
        if (needsBehavior != hasBehavior) {
            params.behavior = if (needsBehavior) AppBarLayout.ScrollingViewBehavior() else null
            stackScreenWrapper.layoutParams = params
        }
    }
}
