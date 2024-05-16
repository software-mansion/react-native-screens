package com.swmansion.rnscreens

import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.fabric.FabricUIManager
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.soloader.SoLoader

class NativeProxy(private val reactContext: ReactApplicationContext) {
    @DoNotStrip
    @Suppress("unused")
    private val mHybridData: HybridData

    init {
        mHybridData = initHybrid()
    }

    private external fun initHybrid(): HybridData
    external fun nativeAddMutationsListener(fabricUIManager: FabricUIManager)

    @DoNotStrip
    public fun notifyScreenRemoved(screenTag: Int) {
        val uiManager = UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC)
        val screen = uiManager?.resolveView(screenTag)
        if (screen is Screen) {
            screen.startRemovalTransition()
        }
    }
}