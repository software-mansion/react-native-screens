package com.swmansion.common

import android.app.Activity
import android.view.View

interface ScreenStackFragmentCommon {
    fun tryGetActivity(): Activity?
    fun onViewAnimationStart()
    fun onViewAnimationEnd()
    fun dispatchTransitionProgress(interpolatedTime: Float, isResumed: Boolean)
    fun getFragmentScreen(): View?
}
