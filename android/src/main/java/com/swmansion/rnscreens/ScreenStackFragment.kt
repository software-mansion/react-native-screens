package com.swmansion.rnscreens

import android.animation.Animator
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import android.view.WindowManager
import android.view.animation.Animation
import android.view.animation.AnimationSet
import android.view.animation.Transformation
import android.view.inputmethod.InputMethodManager
import android.widget.LinearLayout
import androidx.annotation.RequiresApi
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.MaterialShapeDrawable
import com.google.android.material.shape.ShapeAppearanceModel
import com.swmansion.rnscreens.bottomsheet.DimmingViewManager
import com.swmansion.rnscreens.bottomsheet.SheetDelegate
import com.swmansion.rnscreens.bottomsheet.SheetUtils
import com.swmansion.rnscreens.bottomsheet.isSheetFitToContents
import com.swmansion.rnscreens.bottomsheet.useSingleDetent
import com.swmansion.rnscreens.bottomsheet.useThreeDetents
import com.swmansion.rnscreens.bottomsheet.useTwoDetents
import com.swmansion.rnscreens.bottomsheet.usesFormSheetPresentation
import com.swmansion.rnscreens.events.ScreenAnimationDelegate
import com.swmansion.rnscreens.events.ScreenDismissedEvent
import com.swmansion.rnscreens.events.ScreenEventEmitter
import com.swmansion.rnscreens.ext.recycle
import com.swmansion.rnscreens.transition.ExternalBoundaryValuesEvaluator
import com.swmansion.rnscreens.utils.DeviceUtils
import com.swmansion.rnscreens.utils.resolveBackgroundColor

sealed class KeyboardState

object KeyboardNotVisible : KeyboardState()

object KeyboardDidHide : KeyboardState()

class KeyboardVisible(
    val height: Int,
) : KeyboardState()

class ScreenStackFragment :
    ScreenFragment,
    ScreenStackFragmentWrapper {
    public var nativeDismissalObserver: NativeDismissalObserver? = null
    private var appBarLayout: AppBarLayout? = null
    private var toolbar: Toolbar? = null
    private var isToolbarShadowHidden = false
    private var isToolbarTranslucent = false

    private var lastFocusedChild: View? = null

    var searchView: CustomSearchView? = null
    var onSearchViewCreate: ((searchView: CustomSearchView) -> Unit)? = null

    private lateinit var coordinatorLayout: ScreensCoordinatorLayout

    private val screenStack: ScreenStack
        get() {
            val container = screen.container
            check(container is ScreenStack) { "ScreenStackFragment added into a non-stack container" }
            return container
        }

    private val dimmingDelegate =
        lazy(LazyThreadSafetyMode.NONE) {
            DimmingViewManager(screen.reactContext, screen)
        }

    private var sheetDelegate: SheetDelegate? = null

    @SuppressLint("ValidFragment")
    constructor(screenView: Screen) : super(screenView)

    constructor() {
        throw IllegalStateException(
            "ScreenStack fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity.",
        )
    }

    override fun removeToolbar() {
        appBarLayout?.let {
            toolbar?.let { toolbar ->
                if (toolbar.parent === it) {
                    it.removeView(toolbar)
                }
            }
        }
        toolbar = null
    }

    override fun setToolbar(toolbar: Toolbar) {
        appBarLayout?.addView(toolbar)
        toolbar.layoutParams =
            AppBarLayout
                .LayoutParams(
                    AppBarLayout.LayoutParams.MATCH_PARENT,
                    AppBarLayout.LayoutParams.WRAP_CONTENT,
                ).apply { scrollFlags = 0 }
        this.toolbar = toolbar
    }

    override fun setToolbarShadowHidden(hidden: Boolean) {
        if (isToolbarShadowHidden != hidden) {
            appBarLayout?.elevation = if (hidden) 0f else PixelUtil.toPixelFromDIP(4f)
            appBarLayout?.stateListAnimator = null
            isToolbarShadowHidden = hidden
        }
    }

    override fun setToolbarTranslucent(translucent: Boolean) {
        if (isToolbarTranslucent != translucent) {
            val params = screen.layoutParams
            (params as CoordinatorLayout.LayoutParams).behavior =
                if (translucent) null else ScrollingViewBehavior()
            isToolbarTranslucent = translucent
        }
    }

    override fun onContainerUpdate() {
        super.onContainerUpdate()
        screen.headerConfig?.onUpdate()
    }

    override fun onViewAnimationEnd() {
        super.onViewAnimationEnd()

        // Rely on guards inside the callee to detect whether this was indeed appear transition.
        notifyViewAppearTransitionEnd()

        // Rely on guards inside the callee to detect whether this was indeed removal transition.
        screen.endRemovalTransition()
    }

    private fun notifyViewAppearTransitionEnd() {
        val screenStack = view?.parent
        if (screenStack is ScreenStack) {
            screenStack.onViewAppearTransitionEnd()
        }
    }

    // If the Screen has `formSheet` presentation this callback is attached to its behavior.
    // It is responsible for firing detent changed events & removing the sheet from the container
    // once it is hidden by user gesture.
    private val bottomSheetStateCallback =
        object : BottomSheetCallback() {
            private var lastStableState: Int =
                SheetUtils.sheetStateFromDetentIndex(
                    screen.sheetInitialDetentIndex,
                    screen.sheetDetents.count(),
                )

            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                if (SheetUtils.isStateStable(newState)) {
                    lastStableState = newState
                    screen.notifySheetDetentChange(
                        SheetUtils.detentIndexFromSheetState(
                            lastStableState,
                            screen.sheetDetents.count(),
                        ),
                        true,
                    )
                } else if (newState == BottomSheetBehavior.STATE_DRAGGING) {
                    screen.notifySheetDetentChange(
                        SheetUtils.detentIndexFromSheetState(
                            lastStableState,
                            screen.sheetDetents.count(),
                        ),
                        false,
                    )
                }

                if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                    dismissSelf()
                }
            }

            override fun onSlide(
                bottomSheet: View,
                slideOffset: Float,
            ) = Unit
        }

    /**
     * Currently this method dispatches event to JS where state is recomputed and fragment
     * gets removed in the result of incoming state update.
     */
    internal fun dismissSelf() {
        if (!this.isRemoving || !this.isDetached) {
            val reactContext = screen.reactContext
            val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
            UIManagerHelper
                .getEventDispatcherForReactTag(reactContext, screen.id)
                ?.dispatchEvent(ScreenDismissedEvent(surfaceId, screen.id))
        }
    }

    internal fun onSheetCornerRadiusChange() {
        screen.onSheetCornerRadiusChange()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        coordinatorLayout = ScreensCoordinatorLayout(requireContext(), this)

        screen.layoutParams =
            CoordinatorLayout
                .LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.MATCH_PARENT,
                ).apply {
                    behavior =
                        if (screen.usesFormSheetPresentation()) {
                            createAndConfigureBottomSheetBehaviour()
                        } else if (isToolbarTranslucent) {
                            null
                        } else {
                            ScrollingViewBehavior()
                        }
                }

        if (screen.usesFormSheetPresentation()) {
            screen.clipToOutline = true
            // TODO(@kkafar): without this line there is no drawable / outline & nothing shows...? Determine what's going on here
            attachShapeToScreen(screen)
            screen.elevation = screen.sheetElevation
        }

        coordinatorLayout.addView(screen.recycle())

        if (!screen.usesFormSheetPresentation()) {
            appBarLayout =
                context?.let { AppBarLayout(it) }?.apply {
                    // By default AppBarLayout will have a background color set but since we cover the whole layout
                    // with toolbar (that can be semi-transparent) the bar layout background color does not pay a
                    // role. On top of that it breaks screens animations when alfa offscreen compositing is off
                    // (which is the default)
                    setBackgroundColor(Color.TRANSPARENT)
                    layoutParams =
                        AppBarLayout.LayoutParams(
                            AppBarLayout.LayoutParams.MATCH_PARENT,
                            AppBarLayout.LayoutParams.WRAP_CONTENT,
                        )
                }

            coordinatorLayout.addView(appBarLayout)
            if (isToolbarShadowHidden) {
                appBarLayout?.targetElevation = 0f
            }
            toolbar?.let { appBarLayout?.addView(it.recycle()) }
            setHasOptionsMenu(true)
        }
        return coordinatorLayout
    }

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?,
    ) {
        super.onViewCreated(view, savedInstanceState)

        if (!screen.usesFormSheetPresentation()) {
            return
        }

        sheetDelegate = SheetDelegate(screen)

        assert(view == coordinatorLayout)
        dimmingDelegate.value.onViewHierarchyCreated(screen, coordinatorLayout)
        dimmingDelegate.value.onBehaviourAttached(screen, screen.sheetBehavior!!)

        val container = screen.container!!
        coordinatorLayout.measure(
            View.MeasureSpec.makeMeasureSpec(container.width, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(container.height, View.MeasureSpec.EXACTLY),
        )
        coordinatorLayout.layout(0, 0, container.width, container.height)
    }

    override fun onCreateAnimation(
        transit: Int,
        enter: Boolean,
        nextAnim: Int,
    ): Animation? {
        // Ensure onCreateAnimator is called
        return null
    }

    override fun onCreateAnimator(
        transit: Int,
        enter: Boolean,
        nextAnim: Int,
    ): Animator? {
        if (!screen.usesFormSheetPresentation()) {
            // Use animation defined while defining transaction in screen stack
            return null
        }

        val animatorSet = AnimatorSet()
        val dimmingDelegate = dimmingDelegate.value

        if (enter) {
            val alphaAnimator =
                ValueAnimator.ofFloat(0f, dimmingDelegate.maxAlpha).apply {
                    addUpdateListener { anim ->
                        val animatedValue = anim.animatedValue as? Float
                        animatedValue?.let { dimmingDelegate.dimmingView.alpha = it }
                    }
                }
            val startValueCallback = { initialStartValue: Number? -> screen.height.toFloat() }
            val evaluator = ExternalBoundaryValuesEvaluator(startValueCallback, { 0f })
            val slideAnimator =
                ValueAnimator.ofObject(evaluator, screen.height.toFloat(), 0f).apply {
                    addUpdateListener { anim ->
                        val animatedValue = anim.animatedValue as? Float
                        animatedValue?.let { screen.translationY = it }
                    }
                }

            animatorSet
                .play(slideAnimator)
                .takeIf {
                    dimmingDelegate.willDimForDetentIndex(
                        screen,
                        screen.sheetInitialDetentIndex,
                    )
                }?.with(alphaAnimator)
        } else {
            val alphaAnimator =
                ValueAnimator.ofFloat(dimmingDelegate.dimmingView.alpha, 0f).apply {
                    addUpdateListener { anim ->
                        val animatedValue = anim.animatedValue as? Float
                        animatedValue?.let { dimmingDelegate.dimmingView.alpha = it }
                    }
                }
            val slideAnimator =
                ValueAnimator.ofFloat(0f, (coordinatorLayout.bottom - screen.top).toFloat()).apply {
                    addUpdateListener { anim ->
                        val animatedValue = anim.animatedValue as? Float
                        animatedValue?.let { screen.translationY = it }
                    }
                }
            animatorSet.play(alphaAnimator).with(slideAnimator)
        }
        animatorSet.addListener(
            ScreenAnimationDelegate(
                this,
                ScreenEventEmitter(this.screen),
                if (enter) {
                    ScreenAnimationDelegate.AnimationType.ENTER
                } else {
                    ScreenAnimationDelegate.AnimationType.EXIT
                },
            ),
        )
        return animatorSet
    }

    /**
     * This method might return slightly different values depending on code path,
     * but during testing I've found this effect negligible. For practical purposes
     * this is acceptable.
     */
    private fun tryResolveContainerHeight(): Int? {
        if (screen.container != null) {
            return screenStack.height
        }

        context
            ?.resources
            ?.displayMetrics
            ?.heightPixels
            ?.let { return it }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            (context?.getSystemService(Context.WINDOW_SERVICE) as? WindowManager)
                ?.currentWindowMetrics
                ?.bounds
                ?.height()
                ?.let { return it }
        }
        return null
    }

    private val keyboardSheetCallback =
        object : BottomSheetCallback() {
            @RequiresApi(Build.VERSION_CODES.M)
            override fun onStateChanged(
                bottomSheet: View,
                newState: Int,
            ) {
                if (newState == BottomSheetBehavior.STATE_COLLAPSED) {
                    val isImeVisible =
                        WindowInsetsCompat
                            .toWindowInsetsCompat(bottomSheet.rootWindowInsets)
                            .isVisible(WindowInsetsCompat.Type.ime())
                    if (isImeVisible) {
                        // Does it not interfere with React Native focus mechanism? In any case I'm not aware
                        // of different way of hiding the keyboard.
                        // https://stackoverflow.com/questions/1109022/how-can-i-close-hide-the-android-soft-keyboard-programmatically
                        // https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input/visibility

                        // I want to be polite here and request focus before dismissing the keyboard,
                        // however even if it fails I want to try to hide the keyboard. This sometimes works...
                        bottomSheet.requestFocus()
                        val imm = requireContext().getSystemService(InputMethodManager::class.java)
                        imm.hideSoftInputFromWindow(bottomSheet.windowToken, 0)
                    }
                }
            }

            override fun onSlide(
                bottomSheet: View,
                slideOffset: Float,
            ) = Unit
        }

    internal fun configureBottomSheetBehaviour(
        behavior: BottomSheetBehavior<Screen>,
        keyboardState: KeyboardState = KeyboardNotVisible,
    ): BottomSheetBehavior<Screen> {
        val containerHeight = tryResolveContainerHeight()
        check(containerHeight != null) {
            "[RNScreens] Failed to find window height during bottom sheet behaviour configuration"
        }

        behavior.apply {
            isHideable = true
            isDraggable = true

            // It seems that there is a guard in material implementation that will prevent
            // this callback from being registered multiple times.
            addBottomSheetCallback(bottomSheetStateCallback)
        }

        screen.footer?.registerWithSheetBehavior(behavior)

        return when (keyboardState) {
            is KeyboardNotVisible -> {
                when (screen.sheetDetents.count()) {
                    1 ->
                        behavior.apply {
                            val height =
                                if (screen.isSheetFitToContents()) {
                                    screen.contentWrapper
                                        .get()
                                        ?.height
                                        .takeIf { screen.contentWrapper.get()?.isLaidOut == true }
                                } else {
                                    (screen.sheetDetents.first() * containerHeight).toInt()
                                }
                            useSingleDetent(height = height)
                        }

                    2 ->
                        behavior.useTwoDetents(
                            state =
                                SheetUtils.sheetStateFromDetentIndex(
                                    screen.sheetInitialDetentIndex,
                                    screen.sheetDetents.count(),
                                ),
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            secondHeight = (screen.sheetDetents[1] * containerHeight).toInt(),
                        )

                    3 ->
                        behavior.useThreeDetents(
                            state =
                                SheetUtils.sheetStateFromDetentIndex(
                                    screen.sheetInitialDetentIndex,
                                    screen.sheetDetents.count(),
                                ),
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            halfExpandedRatio = (screen.sheetDetents[1] / screen.sheetDetents[2]).toFloat(),
                            expandedOffsetFromTop = ((1 - screen.sheetDetents[2]) * containerHeight).toInt(),
                        )

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.",
                    )
                }
            }

            is KeyboardVisible -> {
                val newMaxHeight =
                    if (behavior.maxHeight - keyboardState.height > 1) {
                        behavior.maxHeight - keyboardState.height
                    } else {
                        behavior.maxHeight
                    }
                when (screen.sheetDetents.count()) {
                    1 ->
                        behavior.apply {
                            useSingleDetent(height = newMaxHeight)
                            addBottomSheetCallback(keyboardSheetCallback)
                        }

                    2 ->
                        behavior.apply {
                            useTwoDetents(
                                state = BottomSheetBehavior.STATE_EXPANDED,
                                secondHeight = newMaxHeight,
                            )
                            addBottomSheetCallback(keyboardSheetCallback)
                        }

                    3 ->
                        behavior.apply {
                            useThreeDetents(
                                state = BottomSheetBehavior.STATE_EXPANDED,
                            )
                            maxHeight = newMaxHeight
                            addBottomSheetCallback(keyboardSheetCallback)
                        }

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.",
                    )
                }
            }

            is KeyboardDidHide -> {
                // Here we assume that the keyboard was either closed explicitly by user,
                // or the user dragged the sheet down. In any case the state should
                // stay unchanged.

                behavior.removeBottomSheetCallback(keyboardSheetCallback)
                when (screen.sheetDetents.count()) {
                    1 ->
                        behavior.useSingleDetent(
                            height = (screen.sheetDetents.first() * containerHeight).toInt(),
                            forceExpandedState = false,
                        )

                    2 ->
                        behavior.useTwoDetents(
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            secondHeight = (screen.sheetDetents[1] * containerHeight).toInt(),
                        )

                    3 ->
                        behavior.useThreeDetents(
                            firstHeight = (screen.sheetDetents[0] * containerHeight).toInt(),
                            halfExpandedRatio = (screen.sheetDetents[1] / screen.sheetDetents[2]).toFloat(),
                            expandedOffsetFromTop = ((1 - screen.sheetDetents[2]) * containerHeight).toInt(),
                        )

                    else -> throw IllegalStateException(
                        "[RNScreens] Invalid detent count ${screen.sheetDetents.count()}. Expected at most 3.",
                    )
                }
            }
        }
    }

    private fun createBottomSheetBehaviour(): BottomSheetBehavior<Screen> = BottomSheetBehavior<Screen>()

    // In general it would be great to create BottomSheetBehaviour only via this method as it runs some
    // side effects.
    private fun createAndConfigureBottomSheetBehaviour(): BottomSheetBehavior<Screen> =
        configureBottomSheetBehaviour(createBottomSheetBehaviour())

    private fun resolveBackgroundColor(screen: Screen): Int? {
        val screenColor =
            (screen.background as? ColorDrawable?)?.color
                ?: (screen.background as? MaterialShapeDrawable?)?.tintList?.defaultColor

        if (screenColor != null) {
            return screenColor
        }

        val contentWrapper = screen.contentWrapper.get()
        if (contentWrapper == null) {
            return null
        }

        val contentWrapperColor = contentWrapper.resolveBackgroundColor()
        return contentWrapperColor
    }

    private fun attachShapeToScreen(screen: Screen) {
        val cornerSize = PixelUtil.toPixelFromDIP(screen.sheetCornerRadius)
        val shapeAppearanceModel =
            ShapeAppearanceModel
                .Builder()
                .apply {
                    setTopLeftCorner(CornerFamily.ROUNDED, cornerSize)
                    setTopRightCorner(CornerFamily.ROUNDED, cornerSize)
                }.build()
        val shape = MaterialShapeDrawable(shapeAppearanceModel)
        val backgroundColor = resolveBackgroundColor(screen)
        shape.setTint(backgroundColor ?: Color.TRANSPARENT)
        screen.background = shape
    }

    override fun onStart() {
        lastFocusedChild?.requestFocus()
        super.onStart()
    }

    override fun onStop() {
        if (DeviceUtils.isPlatformAndroidTV(context)) {
            lastFocusedChild = findLastFocusedChild()
        }

        super.onStop()
    }

    override fun onPrepareOptionsMenu(menu: Menu) {
        // If the screen is a transparent modal with hidden header we don't want to update the toolbar
        // menu because it may erase the menu of the previous screen (which is still visible in these
        // circumstances). See here: https://github.com/software-mansion/react-native-screens/issues/2271
        if (!screen.isTransparent() || screen.headerConfig?.isHeaderHidden == false) {
            updateToolbarMenu(menu)
        }
        return super.onPrepareOptionsMenu(menu)
    }

    override fun onCreateOptionsMenu(
        menu: Menu,
        inflater: MenuInflater,
    ) {
        updateToolbarMenu(menu)
        return super.onCreateOptionsMenu(menu, inflater)
    }

    private fun shouldShowSearchBar(): Boolean {
        val config = screen.headerConfig
        val numberOfSubViews = config?.configSubviewsCount ?: 0
        if (config != null && numberOfSubViews > 0) {
            for (i in 0 until numberOfSubViews) {
                val subView = config.getConfigSubview(i)
                if (subView.type == ScreenStackHeaderSubview.Type.SEARCH_BAR) {
                    return true
                }
            }
        }
        return false
    }

    private fun updateToolbarMenu(menu: Menu) {
        menu.clear()
        if (shouldShowSearchBar()) {
            val currentContext = context
            if (searchView == null && currentContext != null) {
                val newSearchView = CustomSearchView(currentContext, this)
                searchView = newSearchView
                onSearchViewCreate?.invoke(newSearchView)
            }
            menu.add("").apply {
                setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS)
                actionView = searchView
            }
        }
    }

    private fun findLastFocusedChild(): View? {
        var view: View? = screen
        while (view != null) {
            if (view.isFocused) return view
            view = if (view is ViewGroup) view.focusedChild else null
        }

        return null
    }

    override fun canNavigateBack(): Boolean {
        val container: ScreenContainer? = screen.container
        check(container is ScreenStack) { "ScreenStackFragment added into a non-stack container" }
        return if (container.rootScreen == screen) {
            // this screen is the root of the container, if it is nested we can check parent container
            // if it is also a root or not
            val parentFragment = parentFragment
            if (parentFragment is ScreenStackFragment) {
                parentFragment.canNavigateBack()
            } else {
                false
            }
        } else {
            true
        }
    }

    override fun dismissFromContainer() {
        screenStack.dismiss(this)
    }

    private class ScreensCoordinatorLayout(
        context: Context,
        private val fragment: ScreenStackFragment,
        private val pointerEventsImpl: ReactPointerEventsView,
//    ) : CoordinatorLayout(context), ReactCompoundViewGroup, ReactHitSlopView {
    ) : CoordinatorLayout(context),
        ReactPointerEventsView by pointerEventsImpl {
        constructor(context: Context, fragment: ScreenStackFragment) : this(
            context,
            fragment,
            ScreensCoordinatorLayoutPointerEventsImpl(),
        )

        override fun onApplyWindowInsets(insets: WindowInsets?): WindowInsets = super.onApplyWindowInsets(insets)

        private val animationListener: Animation.AnimationListener =
            object : Animation.AnimationListener {
                override fun onAnimationStart(animation: Animation) {
                    fragment.onViewAnimationStart()
                }

                override fun onAnimationEnd(animation: Animation) {
                    fragment.onViewAnimationEnd()
                }

                override fun onAnimationRepeat(animation: Animation) {}
            }

        override fun startAnimation(animation: Animation) {
            // For some reason View##onAnimationEnd doesn't get called for
            // exit transitions so we explicitly attach animation listener.
            // We also have some animations that are an AnimationSet, so we don't wrap them
            // in another set since it causes some visual glitches when going forward.
            // We also set the listener only when going forward, since when going back,
            // there is already a listener for dismiss action added, which would be overridden
            // and also this is not necessary when going back since the lifecycle methods
            // are correctly dispatched then.
            // We also add fakeAnimation to the set of animations, which sends the progress of animation
            val fakeAnimation = ScreensAnimation(fragment).apply { duration = animation.duration }

            if (animation is AnimationSet && !fragment.isRemoving) {
                animation
                    .apply {
                        addAnimation(fakeAnimation)
                        setAnimationListener(animationListener)
                    }.also {
                        super.startAnimation(it)
                    }
            } else {
                AnimationSet(true)
                    .apply {
                        addAnimation(animation)
                        addAnimation(fakeAnimation)
                        setAnimationListener(animationListener)
                    }.also {
                        super.startAnimation(it)
                    }
            }
        }

        /**
         * This method implements a workaround for RN's autoFocus functionality. Because of the way
         * autoFocus is implemented it dismisses soft keyboard in fragment transition
         * due to change of visibility of the view at the start of the transition. Here we override the
         * call to `clearFocus` when the visibility of view is `INVISIBLE` since `clearFocus` triggers the
         * hiding of the keyboard in `ReactEditText.java`.
         */
        override fun clearFocus() {
            if (visibility != INVISIBLE) {
                super.clearFocus()
            }
        }

//        override fun reactTagForTouch(touchX: Float, touchY: Float): Int {
//            throw IllegalStateException("Screen wrapper should never be asked for the view tag")
//        }
//
//        override fun interceptsTouchEvent(touchX: Float, touchY: Float): Boolean {
//            return false
//        }
//
//        override fun getHitSlopRect(): Rect? {
//            val screen: Screen = fragment.screen
// //            left – The X coordinate of the left side of the rectangle
// //            top – The Y coordinate of the top of the rectangle i
// //            right – The X coordinate of the right side of the rectangle
// //            bottom – The Y coordinate of the bottom of the rectangle
//            return Rect(screen.x.toInt(), -screen.y.toInt(), screen.x.toInt() + screen.width, screen.y.toInt() + screen.height)
//        }
    }

    private class ScreensAnimation(
        private val mFragment: ScreenFragment,
    ) : Animation() {
        override fun applyTransformation(
            interpolatedTime: Float,
            t: Transformation,
        ) {
            super.applyTransformation(interpolatedTime, t)
            // interpolated time should be the progress of the current transition
            mFragment.dispatchTransitionProgressEvent(interpolatedTime, !mFragment.isResumed)
        }
    }
}
