package com.swmansion.rnscreens.gamma.stack.screen

import android.view.View
import com.facebook.react.bridge.JSApplicationCausedNativeException
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSStackScreenManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo
import com.swmansion.rnscreens.gamma.stack.header.config.StackHeaderConfig
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenDidAppearEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenDidDisappearEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenDismissEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenNativeDismissPreventedEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenWillAppearEvent
import com.swmansion.rnscreens.gamma.stack.screen.event.StackScreenWillDisappearEvent

@ReactModule(name = StackScreenViewManager.REACT_CLASS)
class StackScreenViewManager :
    ViewGroupManager<StackScreen>(),
    RNSStackScreenManagerInterface<StackScreen> {
    private val delegate: ViewManagerDelegate<StackScreen> = RNSStackScreenManagerDelegate<StackScreen, StackScreenViewManager>(this)

    override fun getName() = REACT_CLASS

    override fun getDelegate() = delegate

    override fun createViewInstance(reactContext: ThemedReactContext) = StackScreen(reactContext)

    override fun addView(
        parent: StackScreen,
        child: View,
        index: Int,
    ) {
        // HeaderConfig is not added to native hierarchy & it must be the last child of StackScreen.
        if (child is StackHeaderConfig) {
            if (index < parent.childCount) {
                throw JSApplicationCausedNativeException(
                    "[RNScreens] StackHeaderConfig must be the last child of StackScreen. ",
                )
            }
            parent.attachHeaderConfig(child)
        } else {
            if (index > parent.childCount) {
                throw JSApplicationCausedNativeException(
                    "[RNScreens] StackHeaderConfig must be the last child of StackScreen. ",
                )
            }
            super.addView(parent, child, index)
        }
    }

    override fun removeView(
        parent: StackScreen,
        view: View,
    ) {
        if (view is StackHeaderConfig) {
            parent.detachHeaderConfig(view)
        } else {
            super.removeView(parent, view)
        }
    }

    override fun removeViewAt(
        parent: StackScreen,
        index: Int,
    ) {
        // HeaderConfig is not added to native hierarchy & it must be the last child of StackScreen.
        if (index == getChildCount(parent) - 1 && parent.headerConfig != null) {
            parent.headerConfig?.let { parent.detachHeaderConfig(it) }
        } else {
            super.removeViewAt(parent, index)
        }
    }

    override fun getChildCount(parent: StackScreen): Int = parent.childCount + if (parent.headerConfig != null) 1 else 0

    override fun getChildAt(
        parent: StackScreen,
        index: Int,
    ): View? {
        if (index == parent.childCount && parent.headerConfig != null) {
            return parent.headerConfig
        }
        return parent.getChildAt(index)
    }

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: StackScreen,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(StackScreenWillAppearEvent),
            makeEventRegistrationInfo(StackScreenWillDisappearEvent),
            makeEventRegistrationInfo(StackScreenDidAppearEvent),
            makeEventRegistrationInfo(StackScreenDidDisappearEvent),
            makeEventRegistrationInfo(StackScreenDismissEvent),
            makeEventRegistrationInfo(StackScreenNativeDismissPreventedEvent),
        )

    override fun updateState(
        view: StackScreen,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.stateWrapper = stateWrapper
        return super.updateState(view, props, stateWrapper)
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

    override fun setPreventNativeDismiss(
        view: StackScreen,
        value: Boolean,
    ) {
        view.isPreventNativeDismissEnabled = value
    }

    companion object {
        const val REACT_CLASS = "RNSStackScreen"
    }
}
