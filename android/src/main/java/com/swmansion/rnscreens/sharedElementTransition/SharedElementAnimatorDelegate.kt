package com.swmansion.rnscreens.sharedElementTransition

import android.content.Context
import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.swmansion.common.ScreenStackFragmentCommon
import com.swmansion.common.SharedElementAnimatorDelegate
import com.swmansion.common.SharedTransitionConfig
import com.swmansion.common.SharedViewConfigCommon

/*
    Mock implementation for Shared Element Transition Delegate. Used if Reanimated is not installed.
*/

class SharedElementAnimatorDelegateMock : SharedElementAnimatorDelegate {
    override fun runTransition(before: View?, after: View?) {}

    override fun onNativeAnimationEnd(screen: View?, toRemove: MutableList<View>?) {}

    override fun makeSnapshot(view: View?) {}

    override fun getSharedElementsIterationOrder(): MutableList<String> {
        return ArrayList()
    }

    override fun isTagUnderTransition(viewTag: Int): Boolean {
        return false
    }

    override fun getSharedElementsForCurrentTransition(
        currentScreen: View?,
        targetScreen: View?
    ): MutableList<SharedTransitionConfig> {
        return ArrayList()
    }

    override fun getTransitionContainer(context: Context): CoordinatorLayout {
        return CoordinatorLayout(context)
    }

    override fun getAnimationCoordinatorLayout(
        context: Context,
        mScreenFragment: ScreenStackFragmentCommon
    ): CoordinatorLayout {
        return ScreensCoordinatorLayout(context, mScreenFragment)
    }
}