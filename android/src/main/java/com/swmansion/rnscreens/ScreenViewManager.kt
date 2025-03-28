package com.swmansion.rnscreens

import android.view.View
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.RNSScreenManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenManagerInterface
import com.swmansion.rnscreens.events.HeaderBackButtonClickedEvent
import com.swmansion.rnscreens.events.HeaderHeightChangeEvent
import com.swmansion.rnscreens.events.ScreenAppearEvent
import com.swmansion.rnscreens.events.ScreenDisappearEvent
import com.swmansion.rnscreens.events.ScreenDismissedEvent
import com.swmansion.rnscreens.events.ScreenTransitionProgressEvent
import com.swmansion.rnscreens.events.ScreenWillAppearEvent
import com.swmansion.rnscreens.events.ScreenWillDisappearEvent
import com.swmansion.rnscreens.events.SheetDetentChangedEvent

@ReactModule(name = ScreenViewManager.REACT_CLASS)
open class ScreenViewManager :
    ViewGroupManager<Screen>(),
    RNSScreenManagerInterface<Screen> {
    private val delegate: ViewManagerDelegate<Screen>

    init {
        delegate = RNSScreenManagerDelegate<Screen, ScreenViewManager>(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = Screen(reactContext)

    override fun setActivityState(
        view: Screen,
        activityState: Float,
    ) {
        setActivityState(view, activityState.toInt())
    }

    override fun addView(
        parent: Screen,
        child: View,
        index: Int,
    ) {
        if (child is ScreenContentWrapper) {
            parent.registerLayoutCallbackForWrapper(child)
        } else if (child is ScreenFooter) {
            parent.footer = child
        }
        super.addView(parent, child, index)
    }

    // Overriding all three remove methods despite the fact, that they all do use removeViewAt in parent
    // class implementation to make it safe in case this changes. Relying on implementation details in this
    // case in unnecessary.
    override fun removeViewAt(
        parent: Screen,
        index: Int,
    ) {
        if (parent.getChildAt(index) is ScreenFooter) {
            parent.footer = null
        }
        super.removeViewAt(parent, index)
    }

    override fun removeView(
        parent: Screen,
        view: View,
    ) {
        super.removeView(parent, view)
        if (view is ScreenFooter) {
            parent.footer = null
        }
    }

    override fun updateState(
        view: Screen,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            view.setStateWrapper(stateWrapper)
        }
        return super.updateState(view, props, stateWrapper)
    }

    // Called after all props are updated for given view
    override fun onAfterUpdateTransaction(view: Screen) {
        super.onAfterUpdateTransaction(view)
        view.onFinalizePropsUpdate()
    }

    @ReactProp(name = "activityState")
    fun setActivityState(
        view: Screen,
        activityState: Int,
    ) {
        if (activityState == -1) {
            // Null will be provided when activityState is set as an animated value and we change
            // it from JS to be a plain value (non animated).
            // In case when null is received, we want to ignore such value and not make
            // any updates as the actual non-null value will follow immediately.
            return
        }
        when (activityState) {
            0 -> view.setActivityState(Screen.ActivityState.INACTIVE)
            1 -> view.setActivityState(Screen.ActivityState.TRANSITIONING_OR_BELOW_TOP)
            2 -> view.setActivityState(Screen.ActivityState.ON_TOP)
        }
    }

    @ReactProp(name = "stackPresentation")
    override fun setStackPresentation(
        view: Screen,
        presentation: String?,
    ) {
        view.stackPresentation =
            when (presentation) {
                "push" -> Screen.StackPresentation.PUSH
                "formSheet" -> Screen.StackPresentation.FORM_SHEET
                "modal", "containedModal", "fullScreenModal", "pageSheet" ->
                    Screen.StackPresentation.MODAL
                "transparentModal", "containedTransparentModal" ->
                    Screen.StackPresentation.TRANSPARENT_MODAL
                else -> throw JSApplicationIllegalArgumentException("Unknown presentation type $presentation")
            }
    }

    @ReactProp(name = "stackAnimation")
    override fun setStackAnimation(
        view: Screen,
        animation: String?,
    ) {
        view.stackAnimation =
            when (animation) {
                null, "default", "flip", "simple_push" -> Screen.StackAnimation.DEFAULT
                "none" -> Screen.StackAnimation.NONE
                "fade" -> Screen.StackAnimation.FADE
                "slide_from_right" -> Screen.StackAnimation.SLIDE_FROM_RIGHT
                "slide_from_left" -> Screen.StackAnimation.SLIDE_FROM_LEFT
                "slide_from_bottom" -> Screen.StackAnimation.SLIDE_FROM_BOTTOM
                "fade_from_bottom" -> Screen.StackAnimation.FADE_FROM_BOTTOM
                "ios_from_right" -> Screen.StackAnimation.IOS_FROM_RIGHT
                "ios_from_left" -> Screen.StackAnimation.IOS_FROM_LEFT
                else -> throw JSApplicationIllegalArgumentException("Unknown animation type $animation")
            }
    }

    @ReactProp(name = "gestureEnabled", defaultBoolean = true)
    override fun setGestureEnabled(
        view: Screen,
        gestureEnabled: Boolean,
    ) {
        view.isGestureEnabled = gestureEnabled
    }

    @ReactProp(name = "replaceAnimation")
    override fun setReplaceAnimation(
        view: Screen,
        animation: String?,
    ) {
        view.replaceAnimation =
            when (animation) {
                null, "pop" -> Screen.ReplaceAnimation.POP
                "push" -> Screen.ReplaceAnimation.PUSH
                else -> throw JSApplicationIllegalArgumentException("Unknown replace animation type $animation")
            }
    }

    @ReactProp(name = "screenOrientation")
    override fun setScreenOrientation(
        view: Screen,
        screenOrientation: String?,
    ) {
        view.setScreenOrientation(screenOrientation)
    }

    @ReactProp(name = "statusBarAnimation")
    override fun setStatusBarAnimation(
        view: Screen,
        statusBarAnimation: String?,
    ) {
        val animated = statusBarAnimation != null && "none" != statusBarAnimation
        view.isStatusBarAnimated = animated
    }

    @Deprecated(
        "For apps targeting SDK 35 or above this prop has no effect. " +
            "Since the edge-to-edge is enabled by default the color is always translucent.",
    )
    @ReactProp(name = "statusBarColor", customType = "Color")
    override fun setStatusBarColor(
        view: Screen,
        statusBarColor: Int?,
    ) {
        view.statusBarColor = statusBarColor
    }

    @ReactProp(name = "statusBarStyle")
    override fun setStatusBarStyle(
        view: Screen,
        statusBarStyle: String?,
    ) {
        view.statusBarStyle = statusBarStyle
    }

    @Deprecated("For apps targeting SDK 35 or above edge-to-edge is enabled by default and will be enforced in the future.")
    @ReactProp(name = "statusBarTranslucent")
    override fun setStatusBarTranslucent(
        view: Screen,
        statusBarTranslucent: Boolean,
    ) {
        view.isStatusBarTranslucent = statusBarTranslucent
    }

    @ReactProp(name = "statusBarHidden")
    override fun setStatusBarHidden(
        view: Screen,
        statusBarHidden: Boolean,
    ) {
        view.isStatusBarHidden = statusBarHidden
    }

    @Deprecated("For apps targeting SDK 35 or above this prop has no effect")
    @ReactProp(name = "navigationBarColor", customType = "Color")
    override fun setNavigationBarColor(
        view: Screen,
        navigationBarColor: Int?,
    ) {
        view.navigationBarColor = navigationBarColor
    }

    @Deprecated("For apps targeting SDK 35 or above edge-to-edge is enabled by default")
    @ReactProp(name = "navigationBarTranslucent")
    override fun setNavigationBarTranslucent(
        view: Screen,
        navigationBarTranslucent: Boolean,
    ) {
        view.isNavigationBarTranslucent = navigationBarTranslucent
    }

    @ReactProp(name = "navigationBarHidden")
    override fun setNavigationBarHidden(
        view: Screen,
        navigationBarHidden: Boolean,
    ) {
        view.isNavigationBarHidden = navigationBarHidden
    }

    @ReactProp(name = "nativeBackButtonDismissalEnabled")
    override fun setNativeBackButtonDismissalEnabled(
        view: Screen,
        nativeBackButtonDismissalEnabled: Boolean,
    ) {
        view.nativeBackButtonDismissalEnabled = nativeBackButtonDismissalEnabled
    }

    @ReactProp(name = "sheetElevation")
    override fun setSheetElevation(
        view: Screen?,
        value: Int,
    ) {
        view?.sheetElevation = value.toFloat()
    }

    // these props are not available on Android, however we must override their setters
    override fun setFullScreenSwipeEnabled(
        view: Screen?,
        value: Boolean,
    ) = Unit

    override fun setFullScreenSwipeShadowEnabled(
        view: Screen?,
        value: Boolean,
    ) = Unit

    override fun setTransitionDuration(
        view: Screen?,
        value: Int,
    ) = Unit

    override fun setHideKeyboardOnSwipe(
        view: Screen?,
        value: Boolean,
    ) = Unit

    override fun setCustomAnimationOnSwipe(
        view: Screen?,
        value: Boolean,
    ) = Unit

    override fun setGestureResponseDistance(
        view: Screen?,
        value: ReadableMap?,
    ) = Unit

    override fun setHomeIndicatorHidden(
        view: Screen?,
        value: Boolean,
    ) = Unit

    override fun setPreventNativeDismiss(
        view: Screen?,
        value: Boolean,
    ) = Unit

    override fun setSwipeDirection(
        view: Screen?,
        value: String?,
    ) = Unit

    @ReactProp(name = "sheetAllowedDetents")
    override fun setSheetAllowedDetents(
        view: Screen,
        value: ReadableArray?,
    ) {
        view.sheetDetents.clear()

        if (value == null || value.size() == 0) {
            view.sheetDetents.add(1.0)
            return
        }

        IntProgression
            .fromClosedRange(0, value.size() - 1, 1)
            .asSequence()
            .map { idx -> value.getDouble(idx) }
            .toCollection(view.sheetDetents)
    }

    @ReactProp(name = "sheetLargestUndimmedDetent")
    override fun setSheetLargestUndimmedDetent(
        view: Screen,
        value: Int,
    ) {
        check(value in -1..2) { "[RNScreens] sheetLargestUndimmedDetent on Android supports values between -1 and 2" }
        view.sheetLargestUndimmedDetentIndex = value
    }

    @ReactProp(name = "sheetGrabberVisible")
    override fun setSheetGrabberVisible(
        view: Screen,
        value: Boolean,
    ) {
        view.isSheetGrabberVisible = value
    }

    @ReactProp(name = "sheetCornerRadius")
    override fun setSheetCornerRadius(
        view: Screen,
        value: Float,
    ) {
        view.sheetCornerRadius = value
    }

    @ReactProp(name = "sheetExpandsWhenScrolledToEdge")
    override fun setSheetExpandsWhenScrolledToEdge(
        view: Screen,
        value: Boolean,
    ) {
        view.sheetExpandsWhenScrolledToEdge = value
    }

    @ReactProp(name = "sheetInitialDetent")
    override fun setSheetInitialDetent(
        view: Screen,
        value: Int,
    ) {
        view.sheetInitialDetentIndex = value
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            ScreenDismissedEvent.EVENT_NAME to MapBuilder.of("registrationName", "onDismissed"),
            ScreenWillAppearEvent.EVENT_NAME to MapBuilder.of("registrationName", "onWillAppear"),
            ScreenAppearEvent.EVENT_NAME to MapBuilder.of("registrationName", "onAppear"),
            ScreenWillDisappearEvent.EVENT_NAME to MapBuilder.of("registrationName", "onWillDisappear"),
            ScreenDisappearEvent.EVENT_NAME to MapBuilder.of("registrationName", "onDisappear"),
            HeaderHeightChangeEvent.EVENT_NAME to MapBuilder.of("registrationName", "onHeaderHeightChange"),
            HeaderBackButtonClickedEvent.EVENT_NAME to MapBuilder.of("registrationName", "onHeaderBackButtonClicked"),
            ScreenTransitionProgressEvent.EVENT_NAME to MapBuilder.of("registrationName", "onTransitionProgress"),
            SheetDetentChangedEvent.EVENT_NAME to MapBuilder.of("registrationName", "onSheetDetentChanged"),
        )

    protected override fun getDelegate(): ViewManagerDelegate<Screen> = delegate

    companion object {
        const val REACT_CLASS = "RNSScreen"
    }
}
