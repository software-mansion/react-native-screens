package com.swmansion.rnscreens.sharedElementTransition

import android.content.Context
import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.swmansion.common.ScreenStackFragmentCommon
import com.swmansion.common.SharedElementAnimatorDelegate
import com.swmansion.rnscreens.ScreenStackFragment

/*
    Mock implementation for Shared Element Transition Delegate. Used if Reanimated is not installed.
*/

class SharedElementAnimatorDelegateMock :
    SharedElementAnimatorDelegate {

    override fun shouldStartDefaultTransitionForView(view: View?): Boolean {
        return true
    }

    override fun onNativeAnimationEnd(screen: View?, toRemove: List<View?>?) {}

    override fun onScreenTransitionCreate(
        currentScreen: View?,
        targetScreen: View?
    ) {}

    override fun onScreenRemoving(screen: View?) {}

    override fun makeAnimationCoordinatorLayout(
        context: Context,
        mFragment: ScreenStackFragmentCommon
    ): CoordinatorLayout {
        return ScreensCoordinatorLayout(context, mFragment as ScreenStackFragment)
    }
}
