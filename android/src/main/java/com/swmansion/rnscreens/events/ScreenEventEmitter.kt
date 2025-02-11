package com.swmansion.rnscreens.events

import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenFragment

// TODO: Consider taking weak ref here or accepting screen as argument in every method
// to avoid reference cycle.
class ScreenEventEmitter(val screen: Screen) {
    val reactEventDispatcher
        get() = screen.reactEventDispatcher

    val reactSurfaceId
        get() = UIManagerHelper.getSurfaceId(screen)

    fun dispatchOnWillAppear() =
        reactEventDispatcher?.dispatchEvent(ScreenWillAppearEvent(reactSurfaceId, screen.id))

    fun dispatchOnAppear() =
        reactEventDispatcher?.dispatchEvent(ScreenAppearEvent(reactSurfaceId, screen.id))

    fun dispatchOnWillDisappear() =
        reactEventDispatcher?.dispatchEvent(ScreenWillDisappearEvent(reactSurfaceId, screen.id))

    fun dispatchOnDisappear() =
        reactEventDispatcher?.dispatchEvent(ScreenDisappearEvent(reactSurfaceId, screen.id))

    fun dispatchOnDismissed() =
        reactEventDispatcher?.dispatchEvent(ScreenDismissedEvent(reactSurfaceId, screen.id))

    fun dispatchTransitionProgress(progress: Float, isExitAnimation: Boolean, isGoingForward: Boolean) {
        val sanitizedProgress = progress.coerceIn(0.0f, 1.0f)
        val coalescingKey = ScreenFragment.getCoalescingKey(sanitizedProgress)
        reactEventDispatcher?.dispatchEvent(ScreenTransitionProgressEvent(reactSurfaceId, screen.id, sanitizedProgress, isExitAnimation, isGoingForward, coalescingKey))
    }
}
