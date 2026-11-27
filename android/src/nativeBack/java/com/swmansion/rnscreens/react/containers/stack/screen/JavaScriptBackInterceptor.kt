package com.swmansion.rnscreens.react.containers.stack.screen

import android.app.Activity
import com.facebook.react.ReactActivity
import com.swmansion.rnscreens.core.containers.stack.screen.BackPressInterceptor

internal fun createJavaScriptBackInterceptor(owner: Activity): BackPressInterceptor? {
    val activity = owner as? ReactActivity ?: return null
    val coordinator = activity.backNavigationCoordinator
    return object : BackPressInterceptor {
        override val isEnabled: Boolean
            get() = coordinator.isNativeNavigationEnabled && coordinator.isJavaScriptEnabled

        override fun dispatch() {
            activity.onBackPressed()
        }

        override fun addListener(listener: Runnable) {
            coordinator.addListener(listener)
        }

        override fun removeListener(listener: Runnable) {
            coordinator.removeListener(listener)
        }
    }
}
