package com.swmansion.rnscreens.util

import com.swmansion.rnscreens.Screen

object RNSUtils {
    @JvmStatic
    fun getDefaultHeaderHeight(width: Int, height: Int, topInset: Int, stackPresentation: Screen.StackPresentation): Int =
        56 + topInset
}
