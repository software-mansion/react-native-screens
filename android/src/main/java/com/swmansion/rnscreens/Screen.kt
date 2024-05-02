package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.graphics.Canvas
import android.graphics.Paint
import android.os.Parcelable
import android.util.Log
import android.util.SparseArray
import android.util.TypedValue
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import android.view.WindowManager
import android.webkit.WebView
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.children
import androidx.fragment.app.Fragment
import com.facebook.react.bridge.GuardedRunnable
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.State
import com.swmansion.rnscreens.events.HeaderHeightChangeEvent

@SuppressLint("ViewConstructor")
class Screen(context: ReactContext?) : FabricEnabledViewGroup(context), ScreenContentWrapper.OnLayoutCallback {
    val fragment: Fragment?
        get() = fragmentWrapper?.fragment

    val sheetBehavior: BottomSheetBehavior<Screen>?
        get() = (layoutParams as? CoordinatorLayout.LayoutParams)?.behavior as? BottomSheetBehavior<Screen>

    val reactContext: ReactContext? = context
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

    // Props for controlling modal presentation
    var isSheetGrabberVisible: Boolean = false
    var sheetCornerRadius: Float = 0F
        set(value) {
            field = value
            (fragment as? ScreenStackFragment)?.onSheetCornerRadiusChange()
        }
    var sheetExpandsWhenScrolledToEdge: Boolean = true
    var sheetDetents = ArrayList<Double>().apply { add(1.0) }
    var sheetLargestUndimmedDetentIndex: Int = -1
    var sheetInitialDetentIndex: Int = 0
    var sheetClosesWhenTouchOutside = true

    var sheetElevation: Float = 24F

    var footer: ScreenFooter? = null

//    val insetCallback =
//        @RequiresApi(Build.VERSION_CODES.R)
//        object : WindowInsetsAnimationCompat.Callback(DISPATCH_MODE_STOP) {
//            var startBottom = 0
//            var endBottom = 0
//            val decorView = reactContext!!.currentActivity!!.window.decorView
//
//            override fun onPrepare(animation: WindowInsetsAnimationCompat) {
//                startBottom = this@Screen.bottom
//                Log.w(TAG, "inset onPrepare, sbottom $startBottom, ebottom: $endBottom")
//
//                ViewCompat.setOnApplyWindowInsetsListener(decorView) { v, insets ->
//                    val isImeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
//                    val imeBottomInset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
//                    val screenBottom = this@Screen.bottom
//                    Log.w(TAG, "inset onApplyWindowInsetsCallback bottomInset: $imeBottomInset, viewBottom: $screenBottom")
//                    endBottom = imeBottomInset
//
//                    if (isImeVisible && this@Screen.stackPresentation == StackPresentation.FORM_SHEET) {
// //                    this@Screen.updatePadding(bottom = imeBottomInset)
//                        Log.w(TAG, "inset onApplyWindowInsetsCallback UPDATE BTM PADDING to $imeBottomInset, viewBottom: $screenBottom")
//                    }
//                    insets
//                }
//                ViewCompat.requestApplyInsets(decorView)
//            }
//
//            override fun onStart(
//                animation: WindowInsetsAnimationCompat,
//                bounds: WindowInsetsAnimationCompat.BoundsCompat,
//            ): WindowInsetsAnimationCompat.BoundsCompat {
// //            endBottom = this@Screen.bottom
// //            endBottom = 1541
//                Log.w(TAG, "inset onStart, sbottom: $startBottom, ebottom: $endBottom, diff: ${startBottom - endBottom}")
//                this@Screen.translationY = (startBottom - endBottom).toFloat()
// //            this@Screen.getChildAt(0).translationY = (startBottom - endBottom).toFloat()
//
//                ViewCompat.setOnApplyWindowInsetsListener(decorView, null)
//                ViewCompat.requestApplyInsets(decorView)
//                return bounds
//            }
//
//            override fun onProgress(
//                insets: WindowInsetsCompat,
//                runningAnimations: MutableList<WindowInsetsAnimationCompat>,
//            ): WindowInsetsCompat {
//                val t = runningAnimations.first().interpolatedFraction
//                val offset = (startBottom - endBottom) * (1 - t)
//                this@Screen.translationY = offset
// //            this@Screen.getChildAt(0).translationY = (startBottom - endBottom).toFloat()
//                Log.w(TAG, "inset onProgress $t -> $offset, bottom: ${this@Screen.bottom}")
//
//                return insets
//            }
//
//            override fun onEnd(animation: WindowInsetsAnimationCompat) {
//                Log.w(TAG, "inset onEnd ${this@Screen.bottom}")
//                super.onEnd(animation)
//            }
//        }

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

//        this.fitsSystemWindows = true
//        val rootView = reactContext!!.currentActivity!!.window.decorView.rootView
        val rootView = reactContext!!.currentActivity!!.window.decorView
//        val rootView = this

//        Log.w(TAG, "Adding listener in Screen")
//        ViewCompat.setOnApplyWindowInsetsListener(rootView) { v, insets ->
//            val isImeVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
//            val imeBottomInset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
//            val screenBottom = this@Screen.bottom
//            Log.w(TAG, "inset onApplyWindowInsetsCallback $imeBottomInset, $screenBottom")
//
//            if (isImeVisible && this.stackPresentation == StackPresentation.FORM_SHEET) {
//                Log.w(TAG, "inset onApplyWindowInsetsCallback UPDATE PADDING to $imeBottomInset, $screenBottom")
//                this.updatePadding(bottom = imeBottomInset)
//            }
//            insets
//        }

//        ViewCompat.setWindowInsetsAnimationCallback(rootView, insetCallback)
    }

    override fun onLayoutCallback(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        val width = right - left
        val height = bottom - top

        if (sheetDetents.count() == 1 && sheetDetents.first() == -1.0) {
            sheetBehavior?.let {
                if (it.maxHeight != height) {
                    it.maxHeight = height
                }
            }
        }
    }

    fun registerLayoutCallbackForWrapper(wrapper: ScreenContentWrapper) {
        wrapper.delegate = this
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
    }

    override fun onApplyWindowInsets(insets: WindowInsets?): WindowInsets {
        return super.onApplyWindowInsets(insets)
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
        Log.w(TAG, "onLayout to $width, $height")
        if (changed) {
            val width = r - l
            val height = b - t

            calculateHeaderHeight()
            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                updateScreenSizeFabric(width, height)
            } else {
                updateScreenSizePaper(width, height)
            }

            footer?.onParentLayout(changed, l, t, r, b, container!!.height)
        }
    }

    private fun updateScreenSizePaper(
        width: Int,
        height: Int,
    ) {
        val reactContext = context as ReactContext
        Log.w(TAG, "updateScreenSize to $width, $height")
        reactContext.runOnNativeModulesQueueThread(
            object : GuardedRunnable(reactContext) {
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
        this.activityState = activityState
        container?.notifyChildUpdate()
    }

    override fun onInterceptTouchEvent(ev: MotionEvent?): Boolean {
        return super.onInterceptTouchEvent(ev)
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
            fragmentWrapper?.let { ScreenWindowTraits.setStyle(this, it.tryGetActivity(), it.tryGetContext()) }
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
            fragmentWrapper?.let { ScreenWindowTraits.setColor(this, it.tryGetActivity(), it.tryGetContext()) }
        }

    var navigationBarColor: Int? = null
        set(navigationBarColor) {
            if (navigationBarColor != null) {
                ScreenWindowTraits.applyDidSetNavigationBarAppearance()
            }
            field = navigationBarColor
            fragmentWrapper?.let { ScreenWindowTraits.setNavigationBarColor(this, it.tryGetActivity()) }
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

    private fun calculateHeaderHeight() {
        val actionBarTv = TypedValue()
        val resolvedActionBarSize = context.theme.resolveAttribute(android.R.attr.actionBarSize, actionBarTv, true)

        // Check if it's possible to get an attribute from theme context and assign a value from it.
        // Otherwise, the default value will be returned.
        val actionBarHeight =
            TypedValue.complexToDimensionPixelSize(actionBarTv.data, resources.displayMetrics)
                .takeIf { resolvedActionBarSize && headerConfig?.isHeaderHidden != true }
                ?.let { PixelUtil.toDIPFromPixel(it.toFloat()).toDouble() } ?: 0.0

        val statusBarHeight =
            context.resources.getIdentifier("status_bar_height", "dimen", "android")
                .takeIf { it > 0 && isStatusBarHidden != true }
                ?.let { (context.resources::getDimensionPixelSize)(it) }
                ?.let { PixelUtil.toDIPFromPixel(it.toFloat()).toDouble() }
                ?: 0.0

        val totalHeight = actionBarHeight + statusBarHeight
        UIManagerHelper.getEventDispatcherForReactTag(context as ReactContext, id)
            ?.dispatchEvent(HeaderHeightChangeEvent(id, totalHeight))
    }

    override fun drawChild(
        canvas: Canvas,
        child: View?,
        drawingTime: Long,
    ): Boolean {
//        if (stackPresentation == StackPresentation.FORM_SHEET && sheetCornerRadius > 0F) {
//            Log.d("Screen", "onDraw inside")
//            val borderRadius = PixelUtil.toPixelFromDIP(sheetCornerRadius)
//            val path = Path()
//            path.rewind()
//            path.addRoundRect(
//                RectF(left.toFloat(), top.toFloat(), right.toFloat(), bottom.toFloat()),
//                floatArrayOf(
//                    borderRadius, borderRadius,
//                    borderRadius, borderRadius,
//                    0F, 0F,
//                    0F, 0F,
//                ),
//                Path.Direction.CCW
//            )
//            val paint = Paint()
//            paint.style = Paint.Style.FILL
//            paint.color = Color.BLACK
//            canvas.drawPath(path, paint)
//        }
        return super.drawChild(canvas, child, drawingTime)
    }

    override fun dispatchDraw(canvas: Canvas) {
//        if (stackPresentation == StackPresentation.FORM_SHEET && sheetCornerRadius > 0F) {
//            Log.d("Screen", "onDraw inside")
//            val borderRadius = PixelUtil.toPixelFromDIP(sheetCornerRadius)
//            val path = Path()
//            path.rewind()
//            path.addRoundRect(
//                RectF(left.toFloat(), top.toFloat(), right.toFloat(), bottom.toFloat()),
//                floatArrayOf(
//                    borderRadius, borderRadius,
//                    borderRadius, borderRadius,
//                    0F, 0F,
//                    0F, 0F,
//                ),
//                Path.Direction.CW
//            )
// //            val paint = Paint()
// //            paint.setColor(Color.RED)
// //            paint.style = Paint.Style.FILL_AND_STROKE
// //            canvas.drawPath(path, paint)
//            canvas.clipPath(path)
//        }
        super.dispatchDraw(canvas)
    }

    override fun draw(canvas: Canvas) {
        super.draw(canvas)
    }

    override fun onDraw(canvas: Canvas) {
//        Log.d("Screen", "onDraw")
//        if (stackPresentation == StackPresentation.FORM_SHEET && sheetCornerRadius > 0F) {
//            Log.d("Screen", "onDraw inside")
//            val borderRadius = PixelUtil.toPixelFromDIP(sheetCornerRadius)
//            val path = Path()
// //            path.rewind()
//            path.addRoundRect(
//                RectF(left.toFloat(), top.toFloat(), right.toFloat(), bottom.toFloat()),
//                floatArrayOf(
//                   borderRadius, borderRadius,
//                    borderRadius, borderRadius,
//                    0F, 0F,
//                    0F, 0F,
//                ),
//                Path.Direction.CW
//            )
//            canvas.clipPath(path)
//        }
        super.onDraw(canvas)
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
        IOS,
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
        NAVIGATION_BAR_HIDDEN,
    }

    companion object {
        const val TAG = "Screen"

        /**
         * This method maps indices from legal detents array (prop) to appropriate values
         * recognized by BottomSheetBehaviour. In particular used when setting up the initial behaviour
         * of the form sheet.
         *
         * @param index index from array with detents fractions
         * @param detentCount length of array with detents fractions
         *
         * @throws IllegalArgumentException for invalid index / detentCount combinations
         */
        fun sheetStateFromDetentIndex(
            index: Int,
            detentCount: Int,
        ): Int =
            when (detentCount) {
                1 ->
                    when (index) {
                        -1 -> BottomSheetBehavior.STATE_HIDDEN
                        0 -> BottomSheetBehavior.STATE_EXPANDED
                        else -> throw IllegalArgumentException("Invalid detentCount/index combination $detentCount / $index")
                    }
                2 ->
                    when (index) {
                        -1 -> BottomSheetBehavior.STATE_HIDDEN
                        0 -> BottomSheetBehavior.STATE_COLLAPSED
                        1 -> BottomSheetBehavior.STATE_EXPANDED
                        else -> throw IllegalArgumentException("Invalid detentCount/index combination $detentCount / $index")
                    }
                3 ->
                    when (index) {
                        -1 -> BottomSheetBehavior.STATE_HIDDEN
                        0 -> BottomSheetBehavior.STATE_COLLAPSED
                        1 -> BottomSheetBehavior.STATE_HALF_EXPANDED
                        2 -> BottomSheetBehavior.STATE_EXPANDED
                        else -> throw IllegalArgumentException("Invalid detentCount/index combination $detentCount / $index")
                    }
                else -> throw IllegalArgumentException("Invalid detentCount/index combination $detentCount / $index")
            }
    }

    /**
     * This method maps BottomSheetBehavior.State values to appropriate indices of detents array.
     *
     * @param state state of the bottom sheet
     * @param detentCount length of array with detents fractions
     *
     * @throws IllegalArgumentException for invalid state / detentCount combinations
     */
    fun detentIndexFromSheetState(@State state: Int, detentCount: Int): Int {
        return when (detentCount) {
            1 -> when (state) {
                BottomSheetBehavior.STATE_HIDDEN -> -1
                BottomSheetBehavior.STATE_EXPANDED -> 0
                else -> throw IllegalArgumentException("Invalid state $state for detentCount $detentCount")
            }
            2 -> when (state) {
                BottomSheetBehavior.STATE_HIDDEN -> -1
                BottomSheetBehavior.STATE_COLLAPSED -> 0
                BottomSheetBehavior.STATE_EXPANDED -> 1
                else -> throw IllegalArgumentException("Invalid state $state for detentCount $detentCount")
            }
            3 -> when (state) {
                BottomSheetBehavior.STATE_HIDDEN -> -1
                BottomSheetBehavior.STATE_COLLAPSED -> 0
                BottomSheetBehavior.STATE_HALF_EXPANDED -> 1
                BottomSheetBehavior.STATE_EXPANDED -> 2
                else -> throw IllegalArgumentException("Invalid state $state for detentCount $detentCount")
            }
            else -> throw IllegalArgumentException("Invalid state $state for detentCount $detentCount")
        }
    }
}
