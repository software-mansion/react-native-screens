package com.swmansion.rnscreens

import android.app.Activity
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.ReactContext

sealed interface IScreenFragment {
    var screen: Screen

    // TODO(kkafar): ScreenContainer should be parameterized with ScreenFragmentInterface + Fragment?
    // Does Kotlin implement algebraic data types?
    val childScreenContainers: List<ScreenContainer<*>>

    fun onContainerUpdate()

    fun tryGetActivity(): Activity?

    fun tryGetContext(): ReactContext?

    fun dispatchHeaderBackButtonClickedEvent()

    fun dispatchTransitionProgress(alpha: Float, isClosing: Boolean)

    fun registerChildScreenContainer(container: ScreenContainer<*>)

    fun unregisterChildScreenContainer(container: ScreenContainer<*>)

    fun onViewAnimationStart()

    fun onViewAnimationEnd()
}