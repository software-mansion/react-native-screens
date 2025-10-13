package com.swmansion.rnscreens

import android.app.Activity
import android.content.pm.ActivityInfo
import android.os.Build
import android.view.View
import android.view.ViewParent
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.swmansion.rnscreens.Screen.WindowTraits

object ScreenWindowTraits {
    // Methods concerning statusBar management were taken from `react-native`'s status bar module:
    // https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/modules/statusbar/StatusBarModule.java
    private var didSetOrientation = false
    private var didSetStatusBarAppearance = false
    private var didSetNavigationBarAppearance = false

    private var windowInsetsListener =
        object : OnApplyWindowInsetsListener {
            override fun onApplyWindowInsets(
                v: View,
                insets: WindowInsetsCompat,
            ): WindowInsetsCompat {
                val defaultInsets = ViewCompat.onApplyWindowInsets(v, insets)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    val windowInsets =
                        defaultInsets.getInsets(WindowInsetsCompat.Type.statusBars())

                    return WindowInsetsCompat
                        .Builder()
                        .setInsets(
                            WindowInsetsCompat.Type.statusBars(),
                            Insets.of(
                                windowInsets.left,
                                0,
                                windowInsets.right,
                                windowInsets.bottom,
                            ),
                        ).build()
                } else {
                    return defaultInsets.replaceSystemWindowInsets(
                        defaultInsets.systemWindowInsetLeft,
                        0,
                        defaultInsets.systemWindowInsetRight,
                        defaultInsets.systemWindowInsetBottom,
                    )
                }
            }
        }

    internal fun applyDidSetOrientation() {
        didSetOrientation = true
    }

    internal fun applyDidSetStatusBarAppearance() {
        didSetStatusBarAppearance = true
    }

    internal fun applyDidSetNavigationBarAppearance() {
        didSetNavigationBarAppearance = true
    }

    internal fun setOrientation(
        screen: Screen,
        activity: Activity?,
    ) {
        if (activity == null) {
            return
        }
        val screenForOrientation = findScreenForTrait(screen, WindowTraits.ORIENTATION)
        val orientation = screenForOrientation?.screenOrientation ?: ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        activity.requestedOrientation = orientation
    }

    internal fun setStyle(
        screen: Screen,
        activity: Activity?,
        context: ReactContext?,
    ) {
        if (activity == null || context == null || Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return
        }
        val screenForStyle = findScreenForTrait(screen, WindowTraits.STYLE)
        val style = screenForStyle?.statusBarStyle ?: "light"

        UiThreadUtil.runOnUiThread {
            val decorView = activity.window.decorView
            val window = activity.window
            val controller = WindowInsetsControllerCompat(window, decorView)

            controller.isAppearanceLightStatusBars = style == "dark"
        }
    }

    internal fun setHidden(
        screen: Screen,
        activity: Activity?,
    ) {
        if (activity == null) {
            return
        }
        val screenForHidden = findScreenForTrait(screen, WindowTraits.HIDDEN)
        val hidden = screenForHidden?.isStatusBarHidden ?: false
        val window = activity.window
        val controller = WindowInsetsControllerCompat(window, window.decorView)

        UiThreadUtil.runOnUiThread {
            if (hidden) {
                controller.hide(WindowInsetsCompat.Type.statusBars())
            } else {
                controller.show(WindowInsetsCompat.Type.statusBars())
            }
        }
    }

    internal fun setNavigationBarHidden(
        screen: Screen,
        activity: Activity?,
    ) {
        if (activity == null) {
            return
        }

        val window = activity.window

        val screenForNavBarHidden = findScreenForTrait(screen, WindowTraits.NAVIGATION_BAR_HIDDEN)
        val hidden = screenForNavBarHidden?.isNavigationBarHidden ?: false

        if (hidden) {
            WindowInsetsControllerCompat(window, window.decorView).let { controller ->
                controller.hide(WindowInsetsCompat.Type.navigationBars())
                controller.systemBarsBehavior =
                    WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            WindowInsetsControllerCompat(
                window,
                window.decorView,
            ).show(WindowInsetsCompat.Type.navigationBars())
        }
    }

    internal fun trySetWindowTraits(
        screen: Screen,
        activity: Activity?,
        context: ReactContext?,
    ) {
        if (didSetOrientation) {
            setOrientation(screen, activity)
        }
        if (didSetStatusBarAppearance) {
            setStyle(screen, activity, context)
            setHidden(screen, activity)
        }
        if (didSetNavigationBarAppearance) {
            setNavigationBarHidden(screen, activity)
        }
    }

    private fun findScreenForTrait(
        screen: Screen,
        trait: WindowTraits,
    ): Screen? {
        val childWithTrait = childScreenWithTraitSet(screen, trait)
        if (childWithTrait != null) {
            return childWithTrait
        }
        return if (checkTraitForScreen(screen, trait)) {
            screen
        } else {
            // if there is no child with trait set and this screen has no trait set, we look for a parent
            // that has the trait set
            findParentWithTraitSet(screen, trait)
        }
    }

    private fun findParentWithTraitSet(
        screen: Screen,
        trait: WindowTraits,
    ): Screen? {
        var parent: ViewParent? = screen.container
        while (parent != null) {
            if (parent is Screen) {
                if (checkTraitForScreen(parent, trait)) {
                    return parent
                }
            }
            parent = parent.parent
        }
        return null
    }

    private fun childScreenWithTraitSet(
        screen: Screen?,
        trait: WindowTraits,
    ): Screen? {
        screen?.fragmentWrapper?.let {
            for (sc in it.childScreenContainers) {
                // we check only the top screen for the trait
                val topScreen = sc.topScreen
                val child = childScreenWithTraitSet(topScreen, trait)
                if (child != null) {
                    return child
                }
                if (topScreen != null && checkTraitForScreen(topScreen, trait)) {
                    return topScreen
                }
            }
        }
        return null
    }

    private fun checkTraitForScreen(
        screen: Screen,
        trait: WindowTraits,
    ): Boolean =
        when (trait) {
            WindowTraits.ORIENTATION -> screen.screenOrientation != null
            WindowTraits.STYLE -> screen.statusBarStyle != null
            WindowTraits.HIDDEN -> screen.isStatusBarHidden != null
            WindowTraits.ANIMATED -> screen.isStatusBarAnimated != null
            WindowTraits.NAVIGATION_BAR_HIDDEN -> screen.isNavigationBarHidden != null
        }
}
