// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea.paper

import com.facebook.react.bridge.ReadableMap

data class SafeAreaViewEdges(
    val left: Boolean,
    val top: Boolean,
    val right: Boolean,
    val bottom: Boolean,
) {
    companion object {
        val ZERO: SafeAreaViewEdges =
            SafeAreaViewEdges(
                left = false,
                top = false,
                right = false,
                bottom = false,
            )

        fun fromProp(map: ReadableMap?): SafeAreaViewEdges? =
            map?.let {
                SafeAreaViewEdges(
                    left = map.getBoolean("left"),
                    top = map.getBoolean("top"),
                    right = map.getBoolean("right"),
                    bottom = map.getBoolean("bottom"),
                )
            }
    }
}
