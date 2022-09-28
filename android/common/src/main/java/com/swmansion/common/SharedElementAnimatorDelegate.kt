package com.swmansion.common

import android.view.View

interface SharedViewConfig {
    val viewTag: Int
    fun getView(): View
    fun setView(view : View)
}

interface SharedElementAnimatorDelegate {
    fun testMethod(number: Int) // TODO: to remove
    fun runTransition(before: View, after: View) // TODO: to remove
    fun afterPreparingCallback()
    fun runTransition(
        converter: View,
        fromView: View,
        startingViewConverter: View,
        toView: View,
        toViewConverter: View,
        transitionType: String
    )
    fun notifyAboutViewDidDisappear(screen: View)
    fun makeSnapshot(view: View, viewController: View)
    fun getSharedTransitionItems(): Map<String, List<SharedViewConfig>>
}