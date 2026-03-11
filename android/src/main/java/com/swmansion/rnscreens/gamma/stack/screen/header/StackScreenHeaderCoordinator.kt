package com.swmansion.rnscreens.gamma.stack.screen.header

import android.content.Context
import androidx.appcompat.view.ContextThemeWrapper
import com.google.android.material.R
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
        if (appBarLayout == null || currentHeaderType == null || currentHeaderType != headerConfigurationProviding.headerType) {
            rebuild(coordinatorLayout, headerConfigurationProviding)
        } else {
            update(headerConfigurationProviding)
        }
    }

    private fun rebuild(
        coordinatorLayout: StackScreenCoordinatorLayout,
        headerConfigurationProviding: StackScreenHeaderConfigurationProviding,
    ) {
        teardown(coordinatorLayout)
        appBarLayout = StackScreenAppBarLayout.create(wrappedContext, headerConfigurationProviding.headerType)
        coordinatorLayout.addView(appBarLayout, 0)
        update(headerConfigurationProviding)
    }

    private fun teardown(coordinatorLayout: StackScreenCoordinatorLayout) {
        coordinatorLayout.removeView(appBarLayout)
        appBarLayout = null
        currentHeaderType = null
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
}
