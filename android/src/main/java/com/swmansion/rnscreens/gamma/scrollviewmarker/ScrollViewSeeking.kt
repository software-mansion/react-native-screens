package com.swmansion.rnscreens.gamma.scrollviewmarker

import android.view.ViewGroup

internal interface ScrollViewSeeking {
    // scrollView is a ViewGroup, because there is no universal ScrollView component on Android.
    // It might a be ScrollView, NestedScrollView (different inheritance hierarchies) or any other
    // ViewGroup that implements appropriate scrolling interfaces.
    fun registerScrollView(
        marker: ScrollViewMarker,
        scrollView: ViewGroup,
    )
}
