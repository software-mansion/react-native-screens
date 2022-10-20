package com.swmansion.common

import android.view.View

/*
common part with react-native-reanimated for Shared Element Transition
 */

interface SharedElementAnimatorDelegate {
    fun runTransition(before: View?, after: View?)
    fun onNativeAnimationEnd(screen: View?, toRemove: List<View?>?)
    fun makeSnapshot(view: View?)
    fun getSharedElementsIterationOrder(): List<String?>?
    fun isTagUnderTransition(viewTag: Int): Boolean
    fun getSharedElementsForCurrentTransition(
        currentScreen: android.view.View?,
        targetScreen: android.view.View?
    ): List<SharedTransitionConfig?>?
}
