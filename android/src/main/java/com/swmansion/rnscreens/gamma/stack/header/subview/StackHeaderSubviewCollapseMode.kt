package com.swmansion.rnscreens.gamma.stack.header.subview

import com.google.android.material.appbar.CollapsingToolbarLayout

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
