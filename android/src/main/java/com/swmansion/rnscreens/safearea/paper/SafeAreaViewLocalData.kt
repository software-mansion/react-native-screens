// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea.paper

import com.swmansion.rnscreens.safearea.EdgeInsets

data class SafeAreaViewLocalData(
    val insets: EdgeInsets,
    val edges: SafeAreaViewEdges,
)
