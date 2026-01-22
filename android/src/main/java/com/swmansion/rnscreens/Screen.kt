package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.graphics.Paint
import android.os.Parcelable
import android.util.SparseArray
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
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
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.EventDispatcher
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.MaterialShapeDrawable
import com.google.android.material.shape.ShapeAppearanceModel
import com.swmansion.rnscreens.bottomsheet.SheetDetents
import com.swmansion.rnscreens.bottomsheet.fitToContentsSheetHeight
import com.swmansion.rnscreens.bottomsheet.isSheetFitToContents
import com.swmansion.rnscreens.bottomsheet.updateMetrics
import com.swmansion.rnscreens.bottomsheet.useSingleDetent
import com.swmansion.rnscreens.bottomsheet.usesFormSheetPresentation
import com.swmansion.rnscreens.events.HeaderHeightChangeEvent
import com.swmansion.rnscreens.events.SheetDetentChangedEvent
import com.swmansion.rnscreens.ext.asScreenStackFragment
import com.swmansion.rnscreens.ext.parentAsViewGroup
import com.swmansion.rnscreens.gamma.common.FragmentProviding
import com.swmansion.rnscreens.utils.getDecorViewTopInset
import kotlin.math.max

@SuppressLint("ViewConstructor") // Only we construct this view, it is never inflated.
class Screen(
    val reactContext: ThemedReactContext,
) : FabricEnabledViewGroup(reactContext),
    ScreenContentWrapper.OnLayoutCallback,
    FragmentProviding {
    val fragment: Fragment?
        get() = fragmentWrapper?.fragment

    val sheetBehavior: BottomSheetBehavior<Screen>?
        get() = (layoutParams as? CoordinatorLayout.LayoutParams)?.behavior as? BottomSheetBehavior<Screen>

    val reactEventDispatcher: EventDispatcher?
        get() = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)

    var insetsApplied = false

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
    var screenId: String? = null
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

    var sheetDetents: SheetDetents = SheetDetents(listOf(1.0))
    var sheetLargestUndimmedDetentIndex: Int = -1
    var sheetInitialDetentIndex: Int = 0
    var sheetClosesOnTouchOutside = true
    var sheetElevation: Float = 24F
    var sheetShouldOverflowTopInset = false
    var sheetDefaultResizeAnimationEnabled = true

    /**
     * On Paper, when using form sheet presentation we want to delay enter transition in order
     * to wait for initial layout from React, otherwise the animator-based animation will look
     * glitchy.
     *
     * On Fabric, the view layout is completed before window insets are applied.
     * To ensure the BottomSheet correctly respects insets during its enter transition,
     * we delay the transition until both layout and insets have been applied.
     */
    var shouldTriggerPostponedTransitionAfterLayout = false

    var footer: ScreenFooter? = null
        set(value) {
            if (value == null && field != null) {
                sheetBehavior?.let { field!!.unregisterWithSheetBehavior(it) }
            } else if (value != null) {
                sheetBehavior?.let { value.registerWithSheetBehavior(it) }
            }
            field = value
        }

    private val isNativeStackScreen: Boolean
        get() = container is ScreenStack

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

    override fun getAssociatedFragment(): Fragment? = fragment

    /**
     * ScreenContentWrapper notifies us here on it's layout. It is essential for implementing
     * `fitToContents` for formSheets, as this is first entry point where we can acquire
     * height of our content.
     */
    override fun onContentWrapperLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        val height = bottom - top

        val sheetBehavior = sheetBehavior
        if (usesFormSheetPresentation()) {
            if (isSheetFitToContents() && sheetBehavior != null) {
                val oldHeight = sheetBehavior.fitToContentsSheetHeight()
                val isInitial = oldHeight == 0
                val heightChanged = oldHeight != height

                if (!heightChanged) {
                    return
                }

                if (isInitial) {
                    setupInitialSheetContentHeight(sheetBehavior, height)
                } else if (sheetDefaultResizeAnimationEnabled) {
                    updateSheetContentHeightWithAnimation(sheetBehavior, oldHeight, height)
                } else {
                    updateSheetContentHeightWithoutAnimation(sheetBehavior, height)
                }
            }

            if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                // On old architecture we delay enter transition in order to wait for initial frame.
                shouldTriggerPostponedTransitionAfterLayout = true
                val parent = parentAsViewGroup()
                if (parent != null && !parent.isInLayout) {
                    // There are reported cases (irreproducible) when Screen is not laid out after
                    // maxHeight is set on behaviour.
                    parent.requestLayout()
                }
            }
        }
    }

    /**
     * This should be used only with sheet in `fitToContents` mode.
     */
    private fun updateSheetContentHeightWithAnimation(
        behavior: BottomSheetBehavior<Screen>,
        oldHeight: Int,
        newHeight: Int,
    ) {
        val currentTranslationY = this.translationY

        /*
         * WHY OVERFLOW MATTERS:
         * BottomSheetBehavior has a physical limit (maxHeight) defined by the parent container.
         * If the new content height exceeds this limit (by its size or keyboard offset), simply
         * animating translationY back to 'currentTranslationY' would attempt to render the sheet
         * larger than the screen.
         *
         * We need to have constraint height inside the container's bounds.
         * By including this overflow to our animation, we ensure the sheet stops
         * expanding exactly at the maxHeight, preventing from being pushed
         * off-screen or causing layout synchronization issues with the CoordinatorLayout.
         */
        val clampedOldHeight = resolveClampedHeight(oldHeight, currentTranslationY)
        val clampedNewHeight = resolveClampedHeight(newHeight, currentTranslationY)
        val visibleDelta = (clampedNewHeight - clampedOldHeight).toFloat()

        if (visibleDelta == 0f) return

        val isContentExpanding = visibleDelta > 0

        if (isContentExpanding) {
            /*
             * Expanding content animation:
             *
             * Before animation, we're updating the SheetBehavior - the maximum height is the new
             * content height, then we're forcing a layout pass. This ensures the view calculates
             * with its new bounds when the animation starts.
             *
             * In the animation, we're translating the Screen back to it's (newly calculated) origin
             * position, providing an impression that FormSheet expands. It already has the final size,
             * but some content is not yet visible on the screen.
             *
             * After animation, we just need to send a notification that ShadowTree state should be updated,
             * as the positioning of pressables has changed due to the Y translation manipulation.
             */
            this.translationY += visibleDelta
            this
                .animate()
                .translationY(currentTranslationY)
                .withStartAction {
                    behavior.updateMetrics(clampedNewHeight)
                    layout(this.left, this.bottom - clampedNewHeight, this.right, this.bottom)
                }.withEndAction {
                    // Force a layout pass on the CoordinatorLayout to synchronize BottomSheetBehavior's
                    // internal offsets with the new maxHeight. This prevents the sheet from snapping back
                    // to its old position when the user starts a gesture.
                    parent.requestLayout()
                    onSheetYTranslationChanged()
                }.start()
        } else {
            /*
             * Shrinking content animation:
             *
             * Before the animation, our Screen translationY is 0 - because its actual layout and visual position are equal.
             *
             * Before the animation, I'm updating sheet metrics to the target value - it won't update until the next layout pass,
             * which is controlled by end action. This is done deliberately, to allow catching the case when quick combination
             * of shrink & expand animation is detected.
             *
             * In the animation, we're translating the Screen down by the calculated height delta to the position (which will
             * be new absolute 0 for the Screen, after ending the transition), providing an impression that FormSheet shrinks.
             * FormSheet's size remains unchanged during the whole animation, therefore there is no view clipping.
             *
             * After animation, we can update the layout: the maximum FormSheet height is updated and we're forcing
             * another layout pass. Additionally, since the actual layout and the target position are equal,
             * we can reset translationY to 0.
             *
             * After animation, we need to send a notification that ShadowTree state should be updated,
             * as the FormSheet size has changed and the positioning of pressables has changed due to the Y translation manipulation.
             */
            val targetTranslationY = currentTranslationY - visibleDelta
            this
                .animate()
                .translationY(targetTranslationY)
                .withStartAction {
                    behavior.updateMetrics(clampedNewHeight)
                }.withEndAction {
                    layout(this.left, this.bottom - clampedNewHeight, this.right, this.bottom)
                    this.translationY = currentTranslationY
                    // Force a layout pass on the CoordinatorLayout to synchronize BottomSheetBehavior's
                    // internal offsets with the new maxHeight. This prevents the sheet from snapping back
                    // to its old position when the user starts a gesture.
                    parent.requestLayout()
                    onSheetYTranslationChanged()
                }.start()
        }
    }

    private fun updateSheetContentHeightWithoutAnimation(
        behavior: BottomSheetBehavior<Screen>,
        height: Int,
    ) {
        /*
         * We're just updating sheets height and forcing Screen layout to be updated immediately.
         * This allows custom animators in RN to work, as we do not interfere with these animations
         * and we're just reacting to the sheet's content size changes.
         */
        val clampedHeight = resolveClampedHeight(height, this.translationY)
        behavior.updateMetrics(clampedHeight)
        layout(this.left, this.bottom - clampedHeight, this.right, this.bottom)

        // Force a layout pass on the CoordinatorLayout to synchronize BottomSheetBehavior's
        // internal offsets with the new maxHeight. This prevents the sheet from snapping back
        // to its old position when the user starts a gesture.
        parent.requestLayout()
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            updateScreenSizeFabric(width, clampedHeight, top + translationY.toInt())
        }
    }

    private fun setupInitialSheetContentHeight(
        behavior: BottomSheetBehavior<Screen>,
        height: Int,
    ) {
        behavior.useSingleDetent(height)
        // During the initial call in `onCreateView`, insets are not yet available,
        // so we need to request an additional layout pass later to account for them.
        requestLayout()
    }

    private fun resolveClampedHeight(
        targetHeight: Int,
        currentTranslationY: Float,
    ): Int {
        val maxAvailableVerticalSpace =
            this.fragment
                ?.asScreenStackFragment()
                ?.sheetDelegate
                ?.tryResolveMaxFormSheetHeight() ?: return targetHeight

        // Please note that currentTranslationY is rather < 0 here.
        // The translation is included in constraining the available space, because the FormSheet can have some offset, e.g. to
        // avoid the keyboard.
        return targetHeight.coerceAtMost((maxAvailableVerticalSpace + currentTranslationY).toInt())
    }

    fun registerLayoutCallbackForWrapper(wrapper: ScreenContentWrapper) {
        wrapper.delegate = this
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
        // In case of form sheet we get layout notification a bit later, in `onBottomSheetBehaviorDidLayout`
        // after the attached behaviour laid out this view.
        if (changed && isNativeStackScreen && !usesFormSheetPresentation()) {
            val width = r - l
            val height = b - t

            if (!insetsApplied && headerConfig?.isHeaderHidden == false && headerConfig?.isHeaderTranslucent == false) {
                val topLevelDecorView =
                    requireNotNull(
                        reactContext.currentActivity?.window?.decorView,
                    ) { "[RNScreens] DecorView is required for applying inset correction, but was null." }

                val topInset = getDecorViewTopInset(topLevelDecorView)
                val correctedHeight = height - topInset
                val correctedOffsetY = t + topInset

                dispatchShadowStateUpdate(width, correctedHeight, correctedOffsetY)
            } else {
                dispatchShadowStateUpdate(width, height, t)
            }
        }
    }

    internal fun onBottomSheetBehaviorDidLayout(coordinatorLayoutDidChange: Boolean) {
        if (!usesFormSheetPresentation() || !isNativeStackScreen) {
            return
        }

        if (isSheetFitToContents()) {
            // The maxHeight may have changed due to incoming top inset.
            // Force a layout pass to sync BottomSheetBehavior's internal offsets with the new value.
            requestLayout()
        }

        if (coordinatorLayoutDidChange) {
            dispatchShadowStateUpdate(width, height, top)
        }

        footer?.onParentLayout(coordinatorLayoutDidChange, left, top, right, bottom, container!!.height)

        if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // When using form sheet presentation we want to delay enter transition **on Paper** in order
            // to wait for initial layout from React, otherwise the animator-based animation will look
            // glitchy. *This seems to not be needed on Fabric*.
            triggerPostponedEnterTransitionIfNeeded()
        }
    }

    // On Fabric, the view layout is completed before window insets are applied.
    // To ensure the BottomSheet correctly respects insets during its enter transition,
    // we delay the transition until both layout and insets have been applied.
    internal fun requestTriggeringPostponedEnterTransition() {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED && !sheetShouldOverflowTopInset) {
            shouldTriggerPostponedTransitionAfterLayout = true
        }
    }

    internal fun triggerPostponedEnterTransitionIfNeeded() {
        if (shouldTriggerPostponedTransitionAfterLayout) {
            shouldTriggerPostponedTransitionAfterLayout = false
            // This will trigger enter transition only if one was requested by ScreenStack
            fragment?.startPostponedEnterTransition()
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

    /**
     * @param offsetY ignored on old architecture
     */
    private fun dispatchShadowStateUpdate(
        width: Int,
        height: Int,
        offsetY: Int,
    ) {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            updateScreenSizeFabric(width, height, offsetY)
        } else {
            updateScreenSizePaper(width, height)
        }
    }

    val headerConfig: ScreenStackHeaderConfig?
        get() = children.find { it is ScreenStackHeaderConfig } as? ScreenStackHeaderConfig

    val contentWrapper: ScreenContentWrapper?
        get() = children.find { it is ScreenContentWrapper } as? ScreenContentWrapper

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

    /**
     * Whether this screen allows to see the content underneath it.
     */
    fun isTranslucent(): Boolean =
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
        container?.onChildUpdate()
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

    fun endRemovalTransition() {
        if (!isBeingRemoved) {
            return
        }
        isBeingRemoved = false
        endTransitionRecursive(this)
    }

    private fun endTransitionRecursive(parent: ViewGroup) {
        parent.children.forEach { childView ->
            parent.endViewTransition(childView)

            if (childView is ScreenStackHeaderConfig) {
                endTransitionRecursive(childView.toolbar)
            }

            if (childView is ViewGroup) {
                endTransitionRecursive(childView)
            }
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
                    startTransitionRecursive(child)
                }
            }
        }
    }

    // We do not want to perform any action, therefore do not need to override the associated method.
    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent?): Boolean =
        if (usesFormSheetPresentation()) {
            // If we're a form sheet we want to consume the gestures to prevent
            // DimmingView's callback from triggering when clicking on the sheet itself.
            true
        } else {
            super.onTouchEvent(event)
        }

    internal fun notifyHeaderHeightChange(headerHeight: Int) {
        val screenContext = context as ReactContext
        val surfaceId = UIManagerHelper.getSurfaceId(screenContext)
        UIManagerHelper
            .getEventDispatcherForReactTag(screenContext, id)
            ?.dispatchEvent(
                HeaderHeightChangeEvent(
                    surfaceId,
                    id,
                    PixelUtil.toDIPFromPixel(headerHeight.toFloat()).toDouble(),
                ),
            )
    }

    internal fun onSheetDetentChanged(
        detentIndex: Int,
        isStable: Boolean,
    ) {
        dispatchSheetDetentChanged(detentIndex, isStable)
        // There is no need to update shadow state for transient sheet states -
        // we are unsure of the exact sheet position anyway.
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED && isStable) {
            onSheetYTranslationChanged()
        }
    }

    internal fun onSheetYTranslationChanged() {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // Translation is relative to the bottom edge, therefore it returns negative values.
            updateScreenSizeFabric(width, height, top + translationY.toInt())
        }
    }

    override fun onApplyWindowInsets(insets: WindowInsets?): WindowInsets? {
        insetsApplied = true

        return super.onApplyWindowInsets(insets)
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        // Insets handler for formSheet is added onResume but it is often too late if we use input
        // with autofocus - onResume is called after finishing animator animation.
        // onAttachedToWindow is called before onApplyWindowInsets so we use it to set the handler
        // earlier. More details: https://github.com/software-mansion/react-native-screens/pull/2911
        if (usesFormSheetPresentation()) {
            fragment?.asScreenStackFragment()?.sheetDelegate?.let {
                InsetsObserverProxy.addOnApplyWindowInsetsListener(
                    it,
                )
            }
        }
    }

    private fun dispatchSheetDetentChanged(
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
            val resolvedCornerRadius = max(PixelUtil.toDIPFromPixel(sheetCornerRadius), 0f)
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
        STYLE,
        HIDDEN,
        ANIMATED,
        NAVIGATION_BAR_HIDDEN,
    }

    companion object {
        const val TAG = "Screen"
    }
}

internal fun View.asScreen() = this as Screen
