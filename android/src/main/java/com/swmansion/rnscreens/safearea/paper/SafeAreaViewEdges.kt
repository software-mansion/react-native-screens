// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea.paper

import com.facebook.react.bridge.ReadableMap

data class SafeAreaViewEdges(
    val top: Boolean,
    val right: Boolean,
    val bottom: Boolean,
    val left: Boolean,
) {
    companion object {
        val NONE: SafeAreaViewEdges = SafeAreaViewEdges(
            top = false,
            right = false,
            bottom = false,
            left = false
        )

        fun fromProp(map: ReadableMap?): SafeAreaViewEdges? = map?.let {
            SafeAreaViewEdges(
                top = map.getBoolean("top"),
                right = map.getBoolean("right"),
                bottom = map.getBoolean("bottom"),
                left = map.getBoolean("left"),
            )
        }
    }
}
