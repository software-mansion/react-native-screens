package com.swmansion.rnscreens

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModuleList
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.swmansion.rnscreens.gamma.tabs.TabScreenViewManager
import com.swmansion.rnscreens.gamma.tabs.TabsHostViewManager
import com.swmansion.rnscreens.utils.ScreenDummyLayoutHelper

// Fool autolinking for older versions that do not support BaseReactPackage.
// public class RNScreensPackage implements TurboReactPackage {
@ReactModuleList(
    nativeModules = [
        ScreensModule::class,
    ],
)
class RNScreensPackage : BaseReactPackage() {
    // We just retain it here. This object helps us tackle jumping content when using native header.
    // See: https://github.com/software-mansion/react-native-screens/pull/2169
    private var screenDummyLayoutHelper: ScreenDummyLayoutHelper? = null

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // This is the earliest we lay our hands on react context.
        // Moreover this is called before FabricUIManger has finished initializing, not to mention
        // installing its C++ bindings - so we are safe in terms of creating this helper
        // before RN starts creating shadow nodes.
        // See https://github.com/software-mansion/react-native-screens/pull/2169
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            screenDummyLayoutHelper = ScreenDummyLayoutHelper(reactContext)
        }

        // Proxy needs to register for lifecycle events in order to unregister itself
        // on activity restarts.
        InsetsObserverProxy.registerWithContext(reactContext)

        return listOf<ViewManager<*, *>>(
            ScreenContainerViewManager(),
            ScreenViewManager(),
            ModalScreenViewManager(),
            ScreenStackViewManager(),
            ScreenStackHeaderConfigViewManager(),
            ScreenStackHeaderSubviewManager(),
            SearchBarManager(),
            ScreenFooterManager(),
            ScreenContentWrapperManager(),
            TabsHostViewManager(),
            TabScreenViewManager(),
        )
    }

    override fun getModule(
        s: String,
        reactApplicationContext: ReactApplicationContext,
    ): NativeModule? {
        when (s) {
            ScreensModule.NAME -> return ScreensModule(reactApplicationContext)
        }
        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
        ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            moduleInfos[ScreensModule.NAME] =
                ReactModuleInfo(
                    ScreensModule.NAME,
                    ScreensModule.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true, // hasConstants
                    false, // isCxxModule
                    isTurboModule,
                )
            moduleInfos
        }

    companion object {
        const val TAG = "RNScreensPackage"
    }
}
