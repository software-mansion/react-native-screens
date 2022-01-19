package com.swmansion.rnscreens

import android.view.View

interface SharedElementAnimatorDelegate {
    fun runTransition(before: View?, after: View?)
}