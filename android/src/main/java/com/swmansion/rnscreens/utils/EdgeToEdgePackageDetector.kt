package com.swmansion.rnscreens.utils

// https://github.com/zoontek/react-native-edge-to-edge/blob/main/react-native-is-edge-to-edge/README.md
object EdgeToEdgePackageDetector {
    // we cannot detect edge-to-edge, but we can detect react-native-edge-to-edge install
    val ENABLED: Boolean =
        try {
            Class.forName("com.zoontek.rnedgetoedge.EdgeToEdgePackage")
            true
        } catch (exception: ClassNotFoundException) {
            false
        }
}
