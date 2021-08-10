package com.swmansion.rnscreens

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import com.swmansion.rnscreens.ScreenContainerViewManager
import com.swmansion.rnscreens.ScreenViewManager
import com.swmansion.rnscreens.ScreenStackViewManager
import com.swmansion.rnscreens.ScreenStackHeaderConfigViewManager
import com.swmansion.rnscreens.ScreenStackHeaderSubviewManager
import java.util.*

class RNScreensPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return Arrays.asList<ViewManager<*, *>>(
            ScreenContainerViewManager(),
            ScreenViewManager(),
            ScreenStackViewManager(),
            ScreenStackHeaderConfigViewManager(),
            ScreenStackHeaderSubviewManager()
        )
    }
}