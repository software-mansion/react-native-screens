package com.swmansion.common

import android.view.View

interface SharedElementAnimatorDelegate {
    fun testMethod(number: Int)
    fun runTransition(view1: View, view2: View)
}