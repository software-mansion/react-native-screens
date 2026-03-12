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
        headerConfigurationProviding: StackScreenHeaderConfigurationProviding,
    ) {
        // TODO: handle hiding the header
        if (headerConfigurationProviding.isHidden) {
            teardown(coordinatorLayout)
        } else if (appBarLayout == null || currentHeaderType == null || currentHeaderType != headerConfigurationProviding.headerType) {
            rebuild(coordinatorLayout, headerConfigurationProviding)
        } else {
            update(headerConfigurationProviding)
        }

        coordinatorLayout.maybeRequestLayoutContainer()
    }

    private fun rebuild(
        coordinatorLayout: StackScreenCoordinatorLayout,
        headerConfigurationProviding: StackScreenHeaderConfigurationProviding,
    ) {
        teardown(coordinatorLayout)
        appBarLayout = StackScreenAppBarLayout.create(wrappedContext, headerConfigurationProviding.headerType)
        coordinatorLayout.addView(appBarLayout, 0)
        update(headerConfigurationProviding)
        updateContentBehavior(coordinatorLayout, false)
    }

    private fun teardown(coordinatorLayout: StackScreenCoordinatorLayout) {
        coordinatorLayout.removeView(appBarLayout)
        appBarLayout = null
        currentHeaderType = null
        updateContentBehavior(coordinatorLayout, true)
    }

    private fun update(headerConfigurationProviding: StackScreenHeaderConfigurationProviding) {
        appBarLayout?.let {
            applyTitle(it, headerConfigurationProviding.title)
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

    private fun updateContentBehavior(
        coordinatorLayout: StackScreenCoordinatorLayout,
        isHidden: Boolean,
    ) {
        val stackScreen = coordinatorLayout.stackScreen
        val params = stackScreen.layoutParams as CoordinatorLayout.LayoutParams
        val needsBehavior = !isHidden && appBarLayout != null
        val hasBehavior = params.behavior != null
        if (needsBehavior != hasBehavior) {
            params.behavior = if (needsBehavior) AppBarLayout.ScrollingViewBehavior() else null
            stackScreen.layoutParams = params
        }
    }
}
