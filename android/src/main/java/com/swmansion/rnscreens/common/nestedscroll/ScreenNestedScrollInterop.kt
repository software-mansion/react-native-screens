package com.swmansion.rnscreens.common.nestedscroll

import android.view.ViewGroup
import androidx.core.view.NestedScrollingParent3

/**
 * Optional Android nested-scroll participant owned outside react-native-screens.
 *
 * Implementations receive the same AndroidX nested-scroll transaction as the screen container,
 * without react-native-screens depending on the implementation. This is intentionally separate
 * from the Container / ContainerItem hierarchy: that hierarchy resolves content through nested
 * navigation containers, while this contract only forwards a transaction already received by the
 * owning CoordinatorLayout.
 */
interface ScreenNestedScrollDelegate : NestedScrollingParent3 {
    fun onScreenAttached(screen: ViewGroup) = Unit

    fun onScreenDetached(screen: ViewGroup) = Unit

    fun onScreenLayout(screen: ViewGroup) = Unit
}

fun interface ScreenNestedScrollDelegateFactory {
    fun create(screen: ViewGroup): ScreenNestedScrollDelegate?
}

/**
 * Process-wide extension point for optional screen nested-scroll delegates.
 *
 * The default is no delegate, preserving existing react-native-screens behavior. A single
 * external owner may install a factory before screens are created. The screen's own CoordinatorLayout
 * behaviors always run first; the delegate can consume only the signed distance left afterwards.
 */
object ScreenNestedScrollInterop {
    @Volatile
    private var factory: ScreenNestedScrollDelegateFactory? = null

    @JvmStatic
    fun installFactory(factory: ScreenNestedScrollDelegateFactory) {
        synchronized(this) {
            check(this.factory == null || this.factory === factory) {
                "[RNScreens] A different ScreenNestedScrollDelegateFactory is already installed."
            }
            this.factory = factory
        }
    }

    @JvmStatic
    fun removeFactory(factory: ScreenNestedScrollDelegateFactory) {
        synchronized(this) {
            if (this.factory === factory) {
                this.factory = null
            }
        }
    }

    internal fun createDelegate(screen: ViewGroup): ScreenNestedScrollDelegate? = factory?.create(screen)
}
