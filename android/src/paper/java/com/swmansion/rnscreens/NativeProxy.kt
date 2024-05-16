package com.swmansion.rnscreens

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.fabric.FabricUIManager

class NativeProxy(private val reactContext: ReactApplicationContext) {
    // do nothing on Paper
    fun nativeAddMutationsListener(fabricUIManager: FabricUIManager) = Unit
}
