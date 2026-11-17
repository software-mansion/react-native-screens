package com.swmansion.rnscreens

import com.facebook.react.BaseReactPackage
import com.facebook.react.ViewManagerOnDemandReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModuleList
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.swmansion.rnscreens.legacy.InsetsObserverProxy
import com.swmansion.rnscreens.legacy.ModalScreenViewManager
import com.swmansion.rnscreens.legacy.ScreenContainerViewManager
import com.swmansion.rnscreens.legacy.ScreenContentWrapperManager
import com.swmansion.rnscreens.legacy.ScreenFooterManager
import com.swmansion.rnscreens.legacy.ScreenStackHeaderConfigViewManager
import com.swmansion.rnscreens.legacy.ScreenStackHeaderSubviewManager
import com.swmansion.rnscreens.legacy.ScreenStackViewManager
import com.swmansion.rnscreens.legacy.ScreenViewManager
import com.swmansion.rnscreens.legacy.SearchBarManager
import com.swmansion.rnscreens.legacy.utils.ScreenDummyLayoutHelper
import com.swmansion.rnscreens.react.containers.stack.header.config.StackHeaderConfigViewManager
import com.swmansion.rnscreens.react.containers.stack.header.subview.StackHeaderSubviewViewManager
import com.swmansion.rnscreens.react.containers.stack.host.StackHostViewManager
import com.swmansion.rnscreens.react.containers.stack.screen.StackScreenViewManager
import com.swmansion.rnscreens.react.containers.tabs.host.TabsHostViewManager
import com.swmansion.rnscreens.react.containers.tabs.screen.TabsScreenViewManager
import com.swmansion.rnscreens.react.modals.formsheet.contentwrapper.FormSheetContentWrapperViewManager
import com.swmansion.rnscreens.react.modals.formsheet.host.FormSheetHostViewManager
import com.swmansion.rnscreens.react.module.ScreensModule
import com.swmansion.rnscreens.react.views.safearea.SafeAreaViewManager
import com.swmansion.rnscreens.react.views.scrollviewmarker.ScrollViewMarkerViewManager
import java.lang.ref.WeakReference

// Fool autolinking for older versions that do not support BaseReactPackage.
// public class RNScreensPackage implements TurboReactPackage {
@ReactModuleList(
    nativeModules = [
        ScreensModule::class,
    ],
)
class RNScreensPackage :
    BaseReactPackage(),
    ViewManagerOnDemandReactPackage {
    // We just retain it here. This object helps us tackle jumping content when using native header.
    // See: https://github.com/software-mansion/react-native-screens/pull/2169
    private var screenDummyLayoutHelper: ScreenDummyLayoutHelper? = null

    private var setUpContext = WeakReference<ReactApplicationContext>(null)

    // React Native asks an on-demand package for its view manager names, or for one view manager,
    // instead of calling `createViewManagers`. Whichever comes first is the earliest we lay our hands
    // on react context, so each of them runs this setup, once per context.
    @Synchronized
    private fun setUpOnce(reactContext: ReactApplicationContext) {
        if (setUpContext.get() === reactContext) return

        // This is called before FabricUIManger has finished initializing, not to mention
        // installing its C++ bindings - so we are safe in terms of creating this helper
        // before RN starts creating shadow nodes.
        // See https://github.com/software-mansion/react-native-screens/pull/2169
        screenDummyLayoutHelper = ScreenDummyLayoutHelper(reactContext)

        // Proxy needs to register for lifecycle events in order to unregister itself
        // on activity restarts.
        InsetsObserverProxy.registerWithContext(reactContext)

        // Recorded last, so a setup that throws is retried on the next call.
        setUpContext = WeakReference(reactContext)
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        setUpOnce(reactContext)
        return VIEW_MANAGERS.values.map { create -> create() }
    }

    // With on-demand view managers, React Native builds a view manager's config (props and events)
    // when JS first uses that view, instead of building the configs of all of them at startup.
    override fun getViewManagerNames(reactContext: ReactApplicationContext): Collection<String> {
        setUpOnce(reactContext)
        return VIEW_MANAGERS.keys
    }

    override fun createViewManager(
        reactContext: ReactApplicationContext,
        viewManagerName: String,
    ): ViewManager<*, *>? {
        setUpOnce(reactContext)
        return VIEW_MANAGERS[viewManagerName]?.invoke()
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
            moduleInfos[ScreensModule.NAME] =
                ReactModuleInfo(
                    ScreensModule.NAME,
                    ScreensModule.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true, // hasConstants
                    false, // isCxxModule
                    true, // isTurboModule
                )
            moduleInfos
        }

    companion object {
        const val TAG = "RNScreensPackage"

        // Every view manager this package registers, by name.
        private val VIEW_MANAGERS: Map<String, () -> ViewManager<*, *>> =
            linkedMapOf(
                ScreenContainerViewManager.REACT_CLASS to ::ScreenContainerViewManager,
                ScreenViewManager.REACT_CLASS to ::ScreenViewManager,
                ModalScreenViewManager.REACT_CLASS to ::ModalScreenViewManager,
                ScreenStackViewManager.REACT_CLASS to ::ScreenStackViewManager,
                ScreenStackHeaderConfigViewManager.REACT_CLASS to ::ScreenStackHeaderConfigViewManager,
                ScreenStackHeaderSubviewManager.REACT_CLASS to ::ScreenStackHeaderSubviewManager,
                SearchBarManager.REACT_CLASS to ::SearchBarManager,
                ScreenFooterManager.REACT_CLASS to ::ScreenFooterManager,
                ScreenContentWrapperManager.REACT_CLASS to ::ScreenContentWrapperManager,
                TabsHostViewManager.REACT_CLASS to ::TabsHostViewManager,
                TabsScreenViewManager.REACT_CLASS to ::TabsScreenViewManager,
                SafeAreaViewManager.REACT_CLASS to ::SafeAreaViewManager,
                StackHostViewManager.REACT_CLASS to ::StackHostViewManager,
                StackScreenViewManager.REACT_CLASS to ::StackScreenViewManager,
                ScrollViewMarkerViewManager.REACT_CLASS to ::ScrollViewMarkerViewManager,
                StackHeaderConfigViewManager.REACT_CLASS to ::StackHeaderConfigViewManager,
                StackHeaderSubviewViewManager.REACT_CLASS to ::StackHeaderSubviewViewManager,
                FormSheetHostViewManager.REACT_CLASS to ::FormSheetHostViewManager,
                FormSheetContentWrapperViewManager.REACT_CLASS to ::FormSheetContentWrapperViewManager,
            )
    }
}
