package com.swmansion.rnscreens.apps

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class AppsPackage : BaseReactPackage() {
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? =
        if (name == AppRestartModule.NAME) {
            AppRestartModule(reactContext)
        } else {
            null
        }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
        ReactModuleInfoProvider {
            mapOf(
                AppRestartModule.NAME to
                    ReactModuleInfo(
                        name = AppRestartModule.NAME,
                        className = AppRestartModule.NAME,
                        canOverrideExistingModule = false,
                        needsEagerInit = false,
                        isCxxModule = false,
                        isTurboModule = true,
                    ),
            )
        }
}
