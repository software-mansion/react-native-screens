package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.graphics.Paint
import android.os.Parcelable
import android.util.SparseArray
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebView
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableType
import com.facebook.react.uimanager.UIManagerModule

@SuppressLint("ViewConstructor")
class Screen constructor(context: ReactContext?) : FabricEnabledViewGroup(context) {

    var fragment: ScreenFragment? = null
    var container: ScreenContainer<*>? = null
    var activityState: ActivityState? = null
        private set
    private var mTransitioning = false
    var stackPresentation = StackPresentation.PUSH
    var replaceAnimation = ReplaceAnimation.POP
    var stackAnimation = StackAnimation.DEFAULT
    var isGestureEnabled = true
    var screenOrientation: Int? = null
    var sharedElementTransitions: List<SharedElementTransitionOptions>? = null
        private set
    private var mStatusBarStyle: String? = null
    private var mStatusBarHidden: Boolean? = null
    private var mStatusBarTranslucent: Boolean? = null
    private var mStatusBarColor: Int? = null
    private var mNavigationBarColor: Int? = null
    private var mNavigationBarHidden: Boolean? = null
    var isStatusBarAnimated: Boolean? = null
    private var mNativeBackButtonDismissalEnabled = true

    init {
        // we set layout params as WindowManager.LayoutParams to workaround the issue with TextInputs
        // not displaying modal menus (e.g., copy/paste or selection). The missing menus are due to the
        // fact that TextView implementation is expected to be attached to window when layout happens.
        // Then, at the moment of layout it checks whether window type is in a reasonable range to tell
        // whether it should enable selection controls (see Editor.java#prepareCursorControllers).
        // With screens, however, the text input component can be laid out before it is attached, in
        // that case TextView tries to get window type property from the oldest existing parent, which
        // in this case is a Screen class, as it is the root of the screen that is about to be attached.
        // Setting params this way is not the most elegant way to solve this problem but workarounds it
        // for the time being
        layoutParams = WindowManager.LayoutParams(WindowManager.LayoutParams.TYPE_APPLICATION)
    }

    override fun dispatchSaveInstanceState(container: SparseArray<Parcelable>) {
        // do nothing, react native will keep the view hierarchy so no need to serialize/deserialize
        // view's states. The side effect of restoring is that TextInput components would trigger
        // set-text events which may confuse text input handling.
    }

    override fun dispatchRestoreInstanceState(container: SparseArray<Parcelable>) {
        // ignore restoring instance state too as we are not saving anything anyways.
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        if (changed) {
            val width = r - l
            val height = b - t
            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                updateScreenSizeFabric(width, height)
            } else {
                updateScreenSizePaper(width, height)
            }
        }
    }

    private fun updateScreenSizePaper(width: Int, height: Int) {
        val reactContext = context as ReactContext
        reactContext.runOnNativeModulesQueueThread(
            object : GuardedRunnable(reactContext) {
                override fun runGuarded() {
                    reactContext
                        .getNativeModule(UIManagerModule::class.java)
                        ?.updateNodeSize(id, width, height)
                }
            })
    }

    val headerConfig: ScreenStackHeaderConfig?
        get() {
            val child = getChildAt(0)
            return if (child is ScreenStackHeaderConfig) {
                child
            } else null
        }

    /**
     * While transitioning this property allows to optimize rendering behavior on Android and provide
     * a correct blending options for the animated screen. It is turned on automatically by the
     * container when transitioning is detected and turned off immediately after
     */
    fun setTransitioning(transitioning: Boolean) {
        if (mTransitioning == transitioning) {
            return
        }
        mTransitioning = transitioning
        val isWebViewInScreen = hasWebView(this)
        if (isWebViewInScreen && layerType != LAYER_TYPE_HARDWARE) {
            return
        }
        super.setLayerType(
            if (transitioning && !isWebViewInScreen) LAYER_TYPE_HARDWARE else LAYER_TYPE_NONE,
            null
        )
    }

    private fun hasWebView(viewGroup: ViewGroup): Boolean {
        for (i in 0 until viewGroup.childCount) {
            val child = viewGroup.getChildAt(i)
            if (child is WebView) {
                return true
            } else if (child is ViewGroup) {
                if (hasWebView(child)) {
                    return true
                }
            }
        }
        return false
    }

    override fun setLayerType(layerType: Int, paint: Paint?) {
        // ignore - layer type is controlled by `transitioning` prop
    }

    fun setActivityState(activityState: ActivityState) {
        if (activityState == this.activityState) {
            return
        }
        this.activityState = activityState
        container?.notifyChildUpdate()
    }

    fun setSharedElementTransitions(readableArray: ReadableArray?) {
        if (readableArray == null) {
            this.sharedElementTransitions = null
            return
        }

        var size = readableArray.size()
        var sharedElementTransitions = ArrayList<SharedElementTransitionOptions>(size)
        for (i in 0 until size) {
            var type = readableArray.getType(i)
            if (type != ReadableType.Map) {
                continue
            }
            var readableMap = readableArray.getMap(i)
            var sharedElementTransitionOption = SharedElementTransitionOptions()

            if (readableMap.hasKey("from")) {
                sharedElementTransitionOption.from = readableMap.getString("from")
            }
            if (readableMap.hasKey("to")) {
                sharedElementTransitionOption.to = readableMap.getString("to")
            }
            if (readableMap.hasKey("delay")) {
                sharedElementTransitionOption.delay = readableMap.getDouble("delay")
            }
            if (readableMap.hasKey("duration")) {
                sharedElementTransitionOption.duration = readableMap.getDouble("duration")
            }
            if (readableMap.hasKey("damping")) {
                sharedElementTransitionOption.damping = readableMap.getDouble("damping").toFloat()
            }
            if (readableMap.hasKey("initialVelocity")) {
                sharedElementTransitionOption.initialVelocity =
                    readableMap.getDouble("initialVelocity").toFloat()
            }
            if (readableMap.hasKey("easing")) {
                sharedElementTransitionOption.easing = when (readableMap.getString("easing")) {
                    "linear" -> Easing.LINEAR
                    "ease-in" -> Easing.EASE_IN
                    "ease-out" -> Easing.EASE_OUT
                    "ease-in-out" -> Easing.EASE_IN_OUT
                    else -> Easing.LINEAR
                }
            }
            if (readableMap.hasKey("showToElementDuringAnimation")) {
                sharedElementTransitionOption.showToElementDuringAnimation =
                    readableMap.getBoolean("showToElementDuringAnimation")
            }
            if (readableMap.hasKey("showFromElementDuringAnimation")) {
                sharedElementTransitionOption.showFromElementDuringAnimation =
                    readableMap.getBoolean("showFromElementDuringAnimation")
            }
            if (readableMap.hasKey("resizeMode")) {
                sharedElementTransitionOption.resizeMode =
                    when (readableMap.getString("resizeMode")) {
                        "resize" -> ResizeMode.RESIZE
                        "none" -> ResizeMode.NONE
                        else -> ResizeMode.RESIZE
                    }
            }
            if (readableMap.hasKey("align")) {
                sharedElementTransitionOption.align = when (readableMap.getString("align")) {
                    "left-top" -> Align.LEFT_TOP
                    "left-center" -> Align.LEFT_CENTER
                    "left-bottom" -> Align.LEFT_BOTTOM
                    "center-top" -> Align.CENTER_TOP
                    "center-center" -> Align.CENTER_CENTER
                    "center-bottom" -> Align.CENTER_BOTTOM
                    "right-top" -> Align.RIGHT_TOP
                    "right-center" -> Align.RIGHT_CENTER
                    "right-bottom" -> Align.RIGHT_BOTTOM
                    else -> Align.LEFT_TOP
                }
            }
            sharedElementTransitions.add(sharedElementTransitionOption)
        }
        this.sharedElementTransitions = sharedElementTransitions
    }

    fun setScreenOrientation(screenOrientation: String?) {
        if (screenOrientation == null) {
            this.screenOrientation = null
            return
        }
        ScreenWindowTraits.applyDidSetOrientation()
        this.screenOrientation = when (screenOrientation) {
            "all" -> ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR
            "portrait" -> ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT
            "portrait_up" -> ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            "portrait_down" -> ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT
            "landscape" -> ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
            "landscape_left" -> ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE
            "landscape_right" -> ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
            else -> ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        }

        fragment?.let { ScreenWindowTraits.setOrientation(this, it.tryGetActivity()) }
    }

    // Accepts one of 4 accessibility flags
    // developer.android.com/reference/android/view/View#attr_android:importantForAccessibility
    fun changeAccessibilityMode(mode: Int) {
        this.importantForAccessibility = mode
        this.headerConfig?.toolbar?.importantForAccessibility = mode
    }

    var statusBarStyle: String?
        get() = mStatusBarStyle
        set(statusBarStyle) {
            if (statusBarStyle != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            mStatusBarStyle = statusBarStyle
            fragment?.let { ScreenWindowTraits.setStyle(this, it.tryGetActivity(), it.tryGetContext()) }
        }

    var isStatusBarHidden: Boolean?
        get() = mStatusBarHidden
        set(statusBarHidden) {
            if (statusBarHidden != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            mStatusBarHidden = statusBarHidden
            fragment?.let { ScreenWindowTraits.setHidden(this, it.tryGetActivity()) }
        }

    var isStatusBarTranslucent: Boolean?
        get() = mStatusBarTranslucent
        set(statusBarTranslucent) {
            if (statusBarTranslucent != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            mStatusBarTranslucent = statusBarTranslucent
            fragment?.let {
                ScreenWindowTraits.setTranslucent(
                    this,
                    it.tryGetActivity(),
                    it.tryGetContext()
                )
            }
        }

    var statusBarColor: Int?
        get() = mStatusBarColor
        set(statusBarColor) {
            if (statusBarColor != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            mStatusBarColor = statusBarColor
            fragment?.let { ScreenWindowTraits.setColor(this, it.tryGetActivity(), it.tryGetContext()) }
        }

    var navigationBarColor: Int?
        get() = mNavigationBarColor
        set(navigationBarColor) {
            if (navigationBarColor != null) {
                ScreenWindowTraits.applyDidSetNavigationBarAppearance()
            }
            mNavigationBarColor = navigationBarColor
            fragment?.let { ScreenWindowTraits.setNavigationBarColor(this, it.tryGetActivity()) }
        }

    var isNavigationBarHidden: Boolean?
        get() = mNavigationBarHidden
        set(navigationBarHidden) {
            if (navigationBarHidden != null) {
                ScreenWindowTraits.applyDidSetNavigationBarAppearance()
            }
            mNavigationBarHidden = navigationBarHidden
            fragment?.let {
                ScreenWindowTraits.setNavigationBarHidden(
                    this,
                    it.tryGetActivity(),
                )
            }
        }

    var nativeBackButtonDismissalEnabled: Boolean
        get() = mNativeBackButtonDismissalEnabled
        set(enableNativeBackButtonDismissal) {
            mNativeBackButtonDismissalEnabled = enableNativeBackButtonDismissal
        }

    // Only used for shared element transitions
    var transitionDuration: Int = 0

    enum class StackPresentation {
        PUSH, MODAL, TRANSPARENT_MODAL
    }

    enum class StackAnimation {
        DEFAULT, NONE, FADE, SLIDE_FROM_BOTTOM, SLIDE_FROM_RIGHT, SLIDE_FROM_LEFT, FADE_FROM_BOTTOM
    }

    enum class ReplaceAnimation {
        PUSH, POP
    }

    enum class ActivityState {
        INACTIVE, TRANSITIONING_OR_BELOW_TOP, ON_TOP
    }

    enum class WindowTraits {
        ORIENTATION, COLOR, STYLE, TRANSLUCENT, HIDDEN, ANIMATED, NAVIGATION_BAR_COLOR, NAVIGATION_BAR_HIDDEN
    }

    enum class Easing {
        LINEAR, EASE_IN, EASE_OUT, EASE_IN_OUT,
    }

    enum class ResizeMode {
        RESIZE, NONE,
    }

    enum class Align {
        LEFT_TOP, LEFT_CENTER, LEFT_BOTTOM, CENTER_TOP, CENTER_CENTER, CENTER_BOTTOM, RIGHT_TOP, RIGHT_CENTER, RIGHT_BOTTOM
    }

    class SharedElementTransitionOptions {
        var from: String? = null
        var to: String? = null
        var delay: Double = 0.0
        var duration: Double = 0.0
        var damping: Float = 1.0f
        var initialVelocity: Float = 0.0f
        var easing: Easing = Easing.LINEAR
        var showFromElementDuringAnimation: Boolean = false
        var showToElementDuringAnimation: Boolean = false
        var resizeMode: ResizeMode = ResizeMode.RESIZE
        var align: Align = Align.LEFT_TOP
    }
}
