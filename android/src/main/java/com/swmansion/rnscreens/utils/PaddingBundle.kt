package com.swmansion.rnscreens.utils

// Used only on Paper together with `setLocalData` mechanism to pass
// the information on header paddings to shadow node.
data class PaddingBundle(
    val paddingStart: Float,
    val paddingEnd: Float,
)
