package com.swmansion.rnscreens.utils

import android.view.ViewGroup
import kotlin.math.max

internal fun findMaxChildrenHeightInStraightLine(viewGroup: ViewGroup, currentMaxHeight: Int = -1, skip: Int = 1): Int {
    if (viewGroup.childCount == 0) {
        if (skip > 0) {
            return -1
        } else {
            return viewGroup.height
        }
    }
    if (skip > 0) {
        val firstChild = viewGroup.getChildAt(0)
        if (firstChild is ViewGroup) {
            return findMaxChildrenHeightInStraightLine(firstChild, -1, skip - 1)
        } else if (skip == 1) {
            return max(firstChild.height, currentMaxHeight)
        } else {
            return -1
        }
    } else {
        val firstChild = viewGroup.getChildAt(0)
        if (firstChild is ViewGroup) {
            return findMaxChildrenHeightInStraightLine(firstChild, viewGroup.height, 0)
        } else {
            return max(max(currentMaxHeight, viewGroup.height), firstChild.height)
        }
    }
}
