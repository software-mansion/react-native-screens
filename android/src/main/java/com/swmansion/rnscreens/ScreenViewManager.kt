package com.swmansion.rnscreens

import com.swmansion.rnscreens.Screen.setActivityState
import com.swmansion.rnscreens.Screen.stackPresentation
import com.swmansion.rnscreens.Screen.stackAnimation
import com.swmansion.rnscreens.Screen.isGestureEnabled
import com.swmansion.rnscreens.Screen.replaceAnimation
import com.swmansion.rnscreens.Screen.setScreenOrientation
import com.swmansion.rnscreens.Screen.isStatusBarAnimated
import com.swmansion.rnscreens.Screen.statusBarColor
import com.swmansion.rnscreens.Screen.statusBarStyle
import com.swmansion.rnscreens.Screen.isStatusBarTranslucent
import com.swmansion.rnscreens.Screen.isStatusBarHidden
import com.facebook.react.module.annotations.ReactModule
import com.swmansion.rnscreens.ScreenViewManager
import com.facebook.react.uimanager.ViewGroupManager
import com.swmansion.rnscreens.Screen
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.common.MapBuilder
import com.swmansion.rnscreens.events.ScreenDismissedEvent
import com.swmansion.rnscreens.events.ScreenWillAppearEvent
import com.swmansion.rnscreens.events.ScreenAppearEvent
import com.swmansion.rnscreens.events.ScreenWillDisappearEvent
import com.swmansion.rnscreens.events.ScreenDisappearEvent
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent

@ReactModule(name = ScreenViewManager.REACT_CLASS)
class ScreenViewManager : ViewGroupManager<Screen>() {
    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(reactContext: ThemedReactContext): Screen {
        return Screen(reactContext)
    }

    @ReactProp(name = "activityState")
    fun setActivityState(view: Screen, activityState: Int?) {
        if (activityState == null) {
            // Null will be provided when activityState is set as an animated value and we change
            // it from JS to be a plain value (non animated).
            // In case when null is received, we want to ignore such value and not make
            // any updates as the actual non-null value will follow immediately.
            return
        }
        if (activityState == 0) {
            view.setActivityState(Screen.ActivityState.INACTIVE)
        } else if (activityState == 1) {
            view.setActivityState(Screen.ActivityState.TRANSITIONING_OR_BELOW_TOP)
        } else if (activityState == 2) {
            view.setActivityState(Screen.ActivityState.ON_TOP)
        }
    }

    @ReactProp(name = "stackPresentation")
    fun setStackPresentation(view: Screen, presentation: String) {
        if ("push" == presentation) {
            view.stackPresentation = Screen.StackPresentation.PUSH
        } else if ("modal" == presentation || "containedModal" == presentation || "fullScreenModal" == presentation || "formSheet" == presentation) {
            // at the moment Android implementation does not handle contained vs regular modals
            view.stackPresentation = Screen.StackPresentation.MODAL
        } else if ("transparentModal" == presentation || "containedTransparentModal" == presentation) {
            // at the moment Android implementation does not handle contained vs regular modals
            view.stackPresentation = Screen.StackPresentation.TRANSPARENT_MODAL
        } else {
            throw JSApplicationIllegalArgumentException("Unknown presentation type $presentation")
        }
    }

    @ReactProp(name = "stackAnimation")
    fun setStackAnimation(view: Screen, animation: String?) {
        if (animation == null || "default" == animation || "simple_push" == animation) {
            view.stackAnimation = Screen.StackAnimation.DEFAULT
        } else if ("none" == animation) {
            view.stackAnimation = Screen.StackAnimation.NONE
        } else if ("fade" == animation) {
            view.stackAnimation = Screen.StackAnimation.FADE
        } else if ("slide_from_right" == animation) {
            view.stackAnimation = Screen.StackAnimation.SLIDE_FROM_RIGHT
        } else if ("slide_from_left" == animation) {
            view.stackAnimation = Screen.StackAnimation.SLIDE_FROM_LEFT
        } else if ("slide_from_bottom" == animation) {
            view.stackAnimation = Screen.StackAnimation.SLIDE_FROM_BOTTOM
        } else if ("fade_from_bottom" == animation) {
            view.stackAnimation = Screen.StackAnimation.FADE_FROM_BOTTOM
        }
    }

    @ReactProp(name = "gestureEnabled", defaultBoolean = true)
    fun setGestureEnabled(view: Screen, gestureEnabled: Boolean) {
        view.isGestureEnabled = gestureEnabled
    }

    @ReactProp(name = "replaceAnimation")
    fun setReplaceAnimation(view: Screen, animation: String?) {
        if (animation == null || "pop" == animation) {
            view.replaceAnimation = Screen.ReplaceAnimation.POP
        } else if ("push" == animation) {
            view.replaceAnimation = Screen.ReplaceAnimation.PUSH
        }
    }

    @ReactProp(name = "screenOrientation")
    fun setScreenOrientation(view: Screen, screenOrientation: String?) {
        view.setScreenOrientation(screenOrientation)
    }

    @ReactProp(name = "statusBarAnimation")
    fun setStatusBarAnimation(view: Screen, statusBarAnimation: String?) {
        val animated = statusBarAnimation != null && "none" != statusBarAnimation
        view.isStatusBarAnimated = animated
    }

    @ReactProp(name = "statusBarColor")
    fun setStatusBarColor(view: Screen, statusBarColor: Int?) {
        view.statusBarColor = statusBarColor
    }

    @ReactProp(name = "statusBarStyle")
    fun setStatusBarStyle(view: Screen, statusBarStyle: String?) {
        view.statusBarStyle = statusBarStyle
    }

    @ReactProp(name = "statusBarTranslucent")
    fun setStatusBarTranslucent(view: Screen, statusBarTranslucent: Boolean?) {
        view.isStatusBarTranslucent = statusBarTranslucent
    }

    @ReactProp(name = "statusBarHidden")
    fun setStatusBarHidden(view: Screen, statusBarHidden: Boolean?) {
        view.isStatusBarHidden = statusBarHidden
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
        return MapBuilder.of<String, Map<String, String>>(
            ScreenDismissedEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onDismissed"),
            ScreenWillAppearEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onWillAppear"),
            ScreenAppearEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onAppear"),
            ScreenWillDisappearEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onWillDisappear"),
            ScreenDisappearEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onDisappear"),
            StackFinishTransitioningEvent.EVENT_NAME,
            MapBuilder.of("registrationName", "onFinishTransitioning")
        )
    }

    companion object {
        const val REACT_CLASS = "RNSScreen"
    }
}