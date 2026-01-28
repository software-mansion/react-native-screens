package com.swmansion.rnscreens.gamma.stack.screen

import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSStackScreenManagerInterface

@ReactModule(name = StackScreenViewManager.REACT_CLASS)
class StackScreenViewManager :
    ViewGroupManager<StackScreen>(),
    RNSStackScreenManagerInterface<StackScreen> {
    private val delegate: ViewManagerDelegate<StackScreen> = RNSStackScreenManagerDelegate<StackScreen, StackScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun getDelegate() = delegate

    override fun createViewInstance(reactContext: ThemedReactContext) = StackScreen(reactContext)

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: StackScreen,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    override fun setActivityMode(
        view: StackScreen,
        value: String?,
    ) {
        when (value) {
            "attached" -> view.activityMode = StackScreen.ActivityMode.ATTACHED
            "detached" -> view.activityMode = StackScreen.ActivityMode.DETACHED
            else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid activity mode: $value.")
        }
    }

    override fun setScreenKey(
        view: StackScreen,
        value: String?,
    ) {
        requireNotNull(value) {
            "[RNScreens] screenKey must not be null."
        }
        view.screenKey = value
    }

    companion object {
        const val REACT_CLASS = "RNSStackScreen"
    }
}
