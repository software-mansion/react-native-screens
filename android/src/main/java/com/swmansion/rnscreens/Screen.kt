package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.graphics.Paint
import android.os.Parcelable
import android.util.SparseArray
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebView
import android.widget.ImageView
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.children
import androidx.fragment.app.Fragment
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.MaterialShapeDrawable
import com.google.android.material.shape.ShapeAppearanceModel
import com.swmansion.rnscreens.events.HeaderHeightChangeEvent
import com.swmansion.rnscreens.events.SheetDetentChangedEvent
import com.swmansion.rnscreens.ext.isInsideScrollViewWithRemoveClippedSubviews
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
class Screen(
    val reactContext: ReactContext,
) : FabricEnabledViewGroup(reactContext),
    ScreenContentWrapper.OnLayoutCallback {
    val fragment: Fragment?
        get() = fragmentWrapper?.fragment

    var contentWrapper = WeakReference<ScreenContentWrapper>(null)

    val sheetBehavior: BottomSheetBehavior<Screen>?
        get() = (layoutParams as? CoordinatorLayout.LayoutParams)?.behavior as? BottomSheetBehavior<Screen>

    val reactEventDispatcher: EventDispatcher?
        get() = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)

    var fragmentWrapper: ScreenFragmentWrapper? = null
    var container: ScreenContainer? = null
    var activityState: ActivityState? = null
        private set
    private var isTransitioning = false
    var stackPresentation = StackPresentation.PUSH
    var replaceAnimation = ReplaceAnimation.POP
    var stackAnimation = StackAnimation.DEFAULT
    var isGestureEnabled = true
    var screenOrientation: Int? = null
        private set
    var isStatusBarAnimated: Boolean? = null
    var isBeingRemoved = false

    // Props for controlling modal presentation
    var isSheetGrabberVisible: Boolean = false

    // corner radius must be updated after all props prop updates from a single transaction
    // have been applied, because it depends on the presentation type.
    private var shouldUpdateSheetCornerRadius = false
    var sheetCornerRadius: Float = 0F
        set(value) {
            if (field != value) {
                field = value
                shouldUpdateSheetCornerRadius = true
            }
        }
    var sheetExpandsWhenScrolledToEdge: Boolean = true

    // We want to make sure here that at least one value is present in this array all the time.
    // TODO: Model this with custom data structure to guarantee that this invariant is not violated.
    var sheetDetents = mutableListOf(1.0)
    var sheetLargestUndimmedDetentIndex: Int = -1
    var sheetInitialDetentIndex: Int = 0
    var sheetClosesOnTouchOutside = true
    var sheetElevation: Float = 24F

    var footer: ScreenFooter? = null
        set(value) {
            if (value == null && field != null) {
                sheetBehavior?.let { field!!.unregisterWithSheetBehavior(it) }
            } else if (value != null) {
                sheetBehavior?.let { value.registerWithSheetBehavior(it) }
            }
            field = value
        }

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

    /**
     * ScreenContentWrapper notifies us here on it's layout. It is essential for implementing
     * `fitToContents` for formSheets, as this is first entry point where we can acquire
     * height of our content.
     */
    override fun onLayoutCallback(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        val height = bottom - top

        if (sheetDetents.count() == 1 && sheetDetents.first() == SHEET_FIT_TO_CONTENTS) {
            sheetBehavior?.let {
                if (it.maxHeight != height) {
                    it.maxHeight = height
                }
            }
        }
    }

    fun registerLayoutCallbackForWrapper(wrapper: ScreenContentWrapper) {
        wrapper.delegate = this
        this.contentWrapper = WeakReference(wrapper)
    }

    override fun dispatchSaveInstanceState(container: SparseArray<Parcelable>) {
        // do nothing, react native will keep the view hierarchy so no need to serialize/deserialize
        // view's states. The side effect of restoring is that TextInput components would trigger
        // set-text events which may confuse text input handling.
    }

    override fun dispatchRestoreInstanceState(container: SparseArray<Parcelable>) {
        // ignore restoring instance state too as we are not saving anything anyways.
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        if (container is ScreenStack && changed) {
            val width = r - l
            val height = b - t

            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                updateScreenSizeFabric(width, height, t)
            } else {
                updateScreenSizePaper(width, height)
            }

            footer?.onParentLayout(changed, l, t, r, b, container!!.height)
            notifyHeaderHeightChange(t)
        }
    }

    private fun updateScreenSizePaper(
        width: Int,
        height: Int,
    ) {
        reactContext.runOnNativeModulesQueueThread(
            object : GuardedRunnable(reactContext.exceptionHandler) {
                override fun runGuarded() {
                    reactContext
                        .getNativeModule(UIManagerModule::class.java)
                        ?.updateNodeSize(id, width, height)
                }
            },
        )
    }

    val headerConfig: ScreenStackHeaderConfig?
        get() = children.find { it is ScreenStackHeaderConfig } as? ScreenStackHeaderConfig

    /**
     * While transitioning this property allows to optimize rendering behavior on Android and provide
     * a correct blending options for the animated screen. It is turned on automatically by the
     * container when transitioning is detected and turned off immediately after
     */
    fun setTransitioning(transitioning: Boolean) {
        if (isTransitioning == transitioning) {
            return
        }
        isTransitioning = transitioning
        val isWebViewInScreen = hasWebView(this)
        if (isWebViewInScreen && layerType != LAYER_TYPE_HARDWARE) {
            return
        }
        super.setLayerType(
            if (transitioning && !isWebViewInScreen) LAYER_TYPE_HARDWARE else LAYER_TYPE_NONE,
            null,
        )
    }

    fun isTransparent(): Boolean =
        when (stackPresentation) {
            StackPresentation.TRANSPARENT_MODAL,
            StackPresentation.FORM_SHEET,
            -> true

            else -> false
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

    override fun setLayerType(
        layerType: Int,
        paint: Paint?,
    ) {
        // ignore - layer type is controlled by `transitioning` prop
    }

    fun setActivityState(activityState: ActivityState) {
        if (activityState == this.activityState) {
            return
        }
        if (container is ScreenStack && this.activityState != null && activityState < this.activityState!!) {
            throw IllegalStateException("[RNScreens] activityState can only progress in NativeStack")
        }
        this.activityState = activityState
        container?.notifyChildUpdate()
    }

    fun setScreenOrientation(screenOrientation: String?) {
        if (screenOrientation == null) {
            this.screenOrientation = null
            return
        }
        ScreenWindowTraits.applyDidSetOrientation()
        this.screenOrientation =
            when (screenOrientation) {
                "all" -> ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR
                "portrait" -> ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT
                "portrait_up" -> ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                "portrait_down" -> ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT
                "landscape" -> ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                "landscape_left" -> ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE
                "landscape_right" -> ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                else -> ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
            }

        fragmentWrapper?.let { ScreenWindowTraits.setOrientation(this, it.tryGetActivity()) }
    }

    // Accepts one of 4 accessibility flags
    // developer.android.com/reference/android/view/View#attr_android:importantForAccessibility
    fun changeAccessibilityMode(mode: Int) {
        this.importantForAccessibility = mode
        this.headerConfig?.toolbar?.importantForAccessibility = mode
    }

    var statusBarStyle: String? = null
        set(statusBarStyle) {
            if (statusBarStyle != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            field = statusBarStyle
            fragmentWrapper?.let {
                ScreenWindowTraits.setStyle(
                    this,
                    it.tryGetActivity(),
                    it.tryGetContext(),
                )
            }
        }

    var isStatusBarHidden: Boolean? = null
        set(statusBarHidden) {
            if (statusBarHidden != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            field = statusBarHidden
            fragmentWrapper?.let { ScreenWindowTraits.setHidden(this, it.tryGetActivity()) }
        }

    var isStatusBarTranslucent: Boolean? = null
        set(statusBarTranslucent) {
            if (statusBarTranslucent != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            field = statusBarTranslucent
            fragmentWrapper?.let {
                ScreenWindowTraits.setTranslucent(
                    this,
                    it.tryGetActivity(),
                    it.tryGetContext(),
                )
            }
        }

    var statusBarColor: Int? = null
        set(statusBarColor) {
            if (statusBarColor != null) {
                ScreenWindowTraits.applyDidSetStatusBarAppearance()
            }
            field = statusBarColor
            fragmentWrapper?.let {
                ScreenWindowTraits.setColor(
                    this,
                    it.tryGetActivity(),
                    it.tryGetContext(),
                )
            }
        }

    var navigationBarColor: Int? = null
        set(navigationBarColor) {
            if (navigationBarColor != null) {
                ScreenWindowTraits.applyDidSetNavigationBarAppearance()
            }
            field = navigationBarColor
            fragmentWrapper?.let {
                ScreenWindowTraits.setNavigationBarColor(
                    this,
                    it.tryGetActivity(),
                )
            }
        }

    var isNavigationBarTranslucent: Boolean? = null
        set(navigationBarTranslucent) {
            if (navigationBarTranslucent != null) {
                ScreenWindowTraits.applyDidSetNavigationBarAppearance()
            }
            field = navigationBarTranslucent
            fragmentWrapper?.let {
                ScreenWindowTraits.setNavigationBarTranslucent(
                    this,
                    it.tryGetActivity(),
                )
            }
        }

    var isNavigationBarHidden: Boolean? = null
        set(navigationBarHidden) {
            if (navigationBarHidden != null) {
                ScreenWindowTraits.applyDidSetNavigationBarAppearance()
            }
            field = navigationBarHidden
            fragmentWrapper?.let {
                ScreenWindowTraits.setNavigationBarHidden(
                    this,
                    it.tryGetActivity(),
                )
            }
        }

    var nativeBackButtonDismissalEnabled: Boolean = true

    fun startRemovalTransition() {
        if (!isBeingRemoved) {
            isBeingRemoved = true
            startTransitionRecursive(this)
        }
    }

    private fun startTransitionRecursive(parent: ViewGroup?) {
        parent?.let {
            for (i in 0 until it.childCount) {
                val child = it.getChildAt(i)
                if (parent is SwipeRefreshLayout && child is ImageView) {
                    // SwipeRefreshLayout class which has CircleImageView as a child,
                    // does not handle `startViewTransition` properly.
                    // It has a custom `getChildDrawingOrder` method which returns
                    // wrong index if we called `startViewTransition` on the views on new arch.
                    // We add a simple View to bump the number of children to make it work.
                    // TODO: find a better way to handle this scenario
                    it.addView(View(context), i)
                } else {
                    child?.let { view -> it.startViewTransition(view) }
                }
                if (child is ScreenStackHeaderConfig) {
                    // we want to start transition on children of the toolbar too,
                    // which is not a child of ScreenStackHeaderConfig
                    startTransitionRecursive(child.toolbar)
                }
                if (child is ViewGroup) {
                    // The children are miscounted when there's a FlatList with
                    // removeClippedSubviews set to true (default).
                    // We add a simple view for each item in the list to make it work as expected.
                    // See https://github.com/software-mansion/react-native-screens/pull/2383
                    if (child.isInsideScrollViewWithRemoveClippedSubviews()) {
                        for (j in 0 until child.childCount) {
                            child.addView(View(context))
                        }
                    }
                    startTransitionRecursive(child)
                }
            }
        }
    }

    private fun notifyHeaderHeightChange(headerHeight: Int) {
        val screenContext = context as ReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(screenContext)
        UIManagerHelper
            .getEventDispatcherForReactTag(screenContext, id)
            ?.dispatchEvent(HeaderHeightChangeEvent(surfaceId, id, headerHeight))
    }

    internal fun notifySheetDetentChange(
        detentIndex: Int,
        isStable: Boolean,
    ) {
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        reactEventDispatcher?.dispatchEvent(
            SheetDetentChangedEvent(
                surfaceId,
                id,
                detentIndex,
                isStable,
            ),
        )
    }

    internal fun onFinalizePropsUpdate() {
        if (shouldUpdateSheetCornerRadius) {
            shouldUpdateSheetCornerRadius = false
            onSheetCornerRadiusChange()
        }
    }

    internal fun onSheetCornerRadiusChange() {
        if (stackPresentation !== StackPresentation.FORM_SHEET || background == null) {
            return
        }
        (background as? MaterialShapeDrawable?)?.let {
            val resolvedCornerRadius = PixelUtil.toDIPFromPixel(sheetCornerRadius)
            it.shapeAppearanceModel =
                ShapeAppearanceModel
                    .Builder()
                    .apply {
                        setTopLeftCorner(CornerFamily.ROUNDED, resolvedCornerRadius)
                        setTopRightCorner(CornerFamily.ROUNDED, resolvedCornerRadius)
                    }.build()
        }
    }

    enum class StackPresentation {
        PUSH,
        MODAL,
        TRANSPARENT_MODAL,
        FORM_SHEET,
    }

    enum class StackAnimation {
        DEFAULT,
        NONE,
        FADE,
        SLIDE_FROM_BOTTOM,
        SLIDE_FROM_RIGHT,
        SLIDE_FROM_LEFT,
        FADE_FROM_BOTTOM,
        IOS_FROM_RIGHT,
        IOS_FROM_LEFT,
    }

    enum class ReplaceAnimation {
        PUSH,
        POP,
    }

    enum class ActivityState {
        INACTIVE,
        TRANSITIONING_OR_BELOW_TOP,
        ON_TOP,
    }

    enum class WindowTraits {
        ORIENTATION,
        COLOR,
        STYLE,
        TRANSLUCENT,
        HIDDEN,
        ANIMATED,
        NAVIGATION_BAR_COLOR,
        NAVIGATION_BAR_TRANSLUCENT,
        NAVIGATION_BAR_HIDDEN,
    }

    companion object {
        const val TAG = "Screen"

        /**
         * This value describes value in sheet detents array that will be treated as `fitToContents` option.
         */
        const val SHEET_FIT_TO_CONTENTS = -1.0
    }
}
