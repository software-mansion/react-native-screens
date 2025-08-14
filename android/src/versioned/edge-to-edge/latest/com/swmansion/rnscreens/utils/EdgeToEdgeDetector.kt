package com.swmansion.rnscreens.utils

import com.facebook.react.views.view.isEdgeToEdgeFeatureFlagOn

object EdgeToEdgeDetector {
    // For RN >= 0.81, we use both isEdgeToEdgeFeatureFlagOn (from react-native) and the presence of
    // react-native-edge-to-edge package to determine if app is in edge-to-edge.
    val ENABLED: Boolean =
        isEdgeToEdgeFeatureFlagOn ||
            try {
                // https://github.com/zoontek/react-native-edge-to-edge/blob/32a206ec7d2f4c3c14967b1984f5881511b65158/react-native-is-edge-to-edge/README.md?plain=1#L43
                Class.forName("com.zoontek.rnedgetoedge.EdgeToEdgePackage")
                true
            } catch (exception: ClassNotFoundException) {
                false
            }
}
