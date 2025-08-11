package com.swmansion.rnscreens.utils

// https://github.com/zoontek/react-native-edge-to-edge/blob/32a206ec7d2f4c3c14967b1984f5881511b65158/react-native-is-edge-to-edge/README.md?plain=1#L43
object EdgeToEdgeDetector {
    // For RN <= 0.80, we cannot detect edge-to-edge, but we can detect
    // react-native-edge-to-edge install
    val ENABLED: Boolean =
        try {
            Class.forName("com.zoontek.rnedgetoedge.EdgeToEdgePackage")
            true
        } catch (exception: ClassNotFoundException) {
            false
        }
}
