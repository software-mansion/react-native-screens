package com.swmansion.common

import android.content.Context
import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout

/*
  Common part with react-native-screens for Shared Element Transition
*/
interface SharedElementAnimatorDelegate {
    fun shouldStartDefaultTransitionForView(view: View?): Boolean
    fun onNativeAnimationEnd(screen: View?, toRemove: List<View?>?)
    fun onScreenTransitionCreate(
        currentScreen: View?,
        targetScreen: View?
    )
    fun onScreenRemoving(view: View?)
    fun makeAnimationCoordinatorLayout(
        context: Context,
        mFragment: ScreenStackFragmentCommon
    ): CoordinatorLayout
}
