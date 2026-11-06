package com.swmansion.rnscreens.apps

import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

/**
 * Reloads the whole React Native instance (JS bundle + surfaces), e.g. after `I18nManager.forceRTL`.
 */
@ReactModule(name = AppRestartModule.NAME)
class AppRestartModule(
    reactContext: ReactApplicationContext,
) : NativeAppRestartSpec(reactContext) {
    override fun getName(): String = NAME

    override fun restart() {
        val application = reactApplicationContext.applicationContext as ReactApplication
        application.reactHost?.reload("RNSAppRestart: restart")
    }

    companion object {
        const val NAME = "RNSAppRestart"
    }
}
