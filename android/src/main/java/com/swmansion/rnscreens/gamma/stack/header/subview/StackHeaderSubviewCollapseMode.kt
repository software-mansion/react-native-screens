package com.swmansion.rnscreens.gamma.stack.header.subview

import com.google.android.material.appbar.CollapsingToolbarLayout

// Currently, PIN collapse mode is unsupported for background
// header subviews. To enable flex layouts within the background
// we use absolute fill, which effectively makes PIN mode equivalent
// to OFF.
// More details: https://github.com/software-mansion/react-native-screens/pull/3796.
enum class StackHeaderSubviewCollapseMode {
    OFF,
    PARALLAX,
    ;

    internal fun toNativeCollapseMode(): Int =
        when (this) {
            OFF -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_OFF
            PARALLAX -> CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PARALLAX
        }
}
