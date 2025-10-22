package com.swmansion.rnscreens

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.annotation.SuppressLint
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
import android.view.animation.Animation
import android.widget.LinearLayout
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.MaterialShapeDrawable
import com.google.android.material.shape.ShapeAppearanceModel
import com.swmansion.rnscreens.bottomsheet.DimmingViewManager
import com.swmansion.rnscreens.bottomsheet.SheetDelegate
import com.swmansion.rnscreens.bottomsheet.usesFormSheetPresentation
import com.swmansion.rnscreens.events.ScreenAnimationDelegate
import com.swmansion.rnscreens.events.ScreenDismissedEvent
import com.swmansion.rnscreens.events.ScreenEventEmitter
import com.swmansion.rnscreens.ext.recycle
import com.swmansion.rnscreens.stack.views.ScreensCoordinatorLayout
import com.swmansion.rnscreens.transition.ExternalBoundaryValuesEvaluator
import com.swmansion.rnscreens.utils.DeviceUtils
import com.swmansion.rnscreens.utils.resolveBackgroundColor
import kotlin.math.max

sealed class KeyboardState

object KeyboardNotVisible : KeyboardState()

object KeyboardDidHide : KeyboardState()

class KeyboardVisible(
    val height: Int,
) : KeyboardState()

class ScreenStackFragment :
    ScreenFragment,
    ScreenStackFragmentWrapper {
    private var appBarLayout: AppBarLayout? = null
    private var toolbar: Toolbar? = null
    private var isToolbarShadowHidden = false
    private var isToolbarTranslucent = false

    private var lastFocusedChild: View? = null

    var searchView: CustomSearchView? = null
    var onSearchViewCreate: ((searchView: CustomSearchView) -> Unit)? = null

    private var fadeAnimationRunning = false

    private var lastKeyboardBottomOffset: Int? = null

    private lateinit var coordinatorLayout: ScreensCoordinatorLayout

    private val screenStack: ScreenStack
        get() {
            val container = screen.container
            check(container is ScreenStack) { "ScreenStackFragment added into a non-stack container" }
            return container
        }

    private var dimmingDelegate: DimmingViewManager? = null

    internal var sheetDelegate: SheetDelegate? = null

    @SuppressLint("ValidFragment")
    constructor(screenView: Screen) : super(screenView)

    constructor() {
        throw IllegalStateException(
            "ScreenStack fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity.",
        )
    }

    override fun isTranslucent(): Boolean = screen.isTranslucent()

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
                            createBottomSheetBehaviour()
                        } else if (isToolbarTranslucent) {
                            null
                        } else {
                            ScrollingViewBehavior()
                        }
                }

        // This must be called before further sheet configuration.
        // Otherwise there is no enter animation -> dunno why, just observed it.
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
        } else {
            screen.clipToOutline = true
            // TODO(@kkafar): without this line there is no drawable / outline & nothing shows...? Determine what's going on here
            attachShapeToScreen(screen)
            screen.elevation = screen.sheetElevation

            // Lifecycle of sheet delegate is tied to fragment.
            val sheetDelegate = requireSheetDelegate()
            sheetDelegate.configureBottomSheetBehaviour(screen.sheetBehavior!!)

            val dimmingDelegate = requireDimmingDelegate(forceCreation = true)
            dimmingDelegate.onViewHierarchyCreated(screen, coordinatorLayout)
            dimmingDelegate.onBehaviourAttached(screen, screen.sheetBehavior!!)

            // Pre-layout the content for the sake of enter transition.

            val container = screen.container!!
            coordinatorLayout.measure(
                View.MeasureSpec.makeMeasureSpec(container.width, View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(container.height, View.MeasureSpec.EXACTLY),
            )
            coordinatorLayout.layout(0, 0, container.width, container.height)

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                ViewCompat.setOnApplyWindowInsetsListener(screen) { _, windowInsets ->
                    handleKeyboardInsetsProgress(windowInsets)
                    windowInsets
                }
            }

            val insetsAnimationCallback =
                object : WindowInsetsAnimationCompat.Callback(
                    WindowInsetsAnimationCompat.Callback.DISPATCH_MODE_STOP,
                ) {
                    // Replace InsetsAnimationCallback created by BottomSheetBehavior
                    // to avoid interfering with custom animations.
                    // See: https://github.com/software-mansion/react-native-screens/pull/2909
                    override fun onProgress(
                        insets: WindowInsetsCompat,
                        runningAnimations: MutableList<WindowInsetsAnimationCompat>,
                    ): WindowInsetsCompat {
                        // On API 30+, we handle keyboard inset animation progress here.
                        // On lower APIs, we rely on ViewCompat.setOnApplyWindowInsetsListener instead.
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                            handleKeyboardInsetsProgress(insets)
                        }
                        return insets
                    }
                }

            ViewCompat.setWindowInsetsAnimationCallback(screen, insetsAnimationCallback)
        }

        return coordinatorLayout
    }

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?,
    ) {
        super.onViewCreated(view, savedInstanceState)
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

        return if (enter) createEnterAnimator() else createExitAnimator()
    }

    private fun createEnterAnimator(): Animator {
        val animatorSet = AnimatorSet()
        val dimmingDelegate = requireDimmingDelegate()

        val alphaAnimator = createAlphaAnimator(0f, dimmingDelegate.maxAlpha)
        val slideAnimator = createSlideInAnimator()

        animatorSet
            .play(slideAnimator)
            .takeIf {
                dimmingDelegate.willDimForDetentIndex(
                    screen,
                    screen.sheetInitialDetentIndex,
                )
            }?.with(alphaAnimator)

        attachCommonListeners(animatorSet, isEnter = true)

        return animatorSet
    }

    private fun createExitAnimator(): Animator {
        val animatorSet = AnimatorSet()
        val dimmingDelegate = requireDimmingDelegate()

        val alphaAnimator = createAlphaAnimator(dimmingDelegate.dimmingView.alpha, 0f)
        val slideAnimator = createSlideOutAnimator()

        animatorSet.play(alphaAnimator).with(slideAnimator)

        attachCommonListeners(animatorSet, isEnter = false)

        return animatorSet
    }

    private fun createAlphaAnimator(
        from: Float,
        to: Float,
    ): ValueAnimator =
        ValueAnimator.ofFloat(from, to).apply {
            addUpdateListener { animator ->
                (animator.animatedValue as? Float)?.let {
                    requireDimmingDelegate().dimmingView.alpha = it
                }
            }
        }

    private fun createSlideInAnimator(): ValueAnimator {
        val startValueCallback = { _: Number? -> screen.height.toFloat() }
        val evaluator = ExternalBoundaryValuesEvaluator(startValueCallback, { 0f })

        return ValueAnimator.ofObject(evaluator, screen.height.toFloat(), 0f).apply {
            addUpdateListener { updateScreenTranslation(it.animatedValue as Float) }
        }
    }

    private fun createSlideOutAnimator(): ValueAnimator {
        val endValue = (coordinatorLayout.bottom - screen.top - screen.translationY)
        return ValueAnimator.ofFloat(0f, endValue).apply {
            addUpdateListener {
                updateScreenTranslation(it.animatedValue as Float)
            }
        }
    }

    private fun updateScreenTranslation(baseTranslationY: Float) {
        val keyboardCorrection = lastKeyboardBottomOffset ?: 0
        val bottomOffset = sheetDelegate?.calculateSheetOffsetY(keyboardCorrection)?.toFloat() ?: 0f

        screen.translationY = baseTranslationY - bottomOffset
    }

    private fun attachCommonListeners(
        animatorSet: AnimatorSet,
        isEnter: Boolean,
    ) {
        animatorSet.addListener(
            ScreenAnimationDelegate(
                this,
                ScreenEventEmitter(this.screen),
                if (isEnter) {
                    ScreenAnimationDelegate.AnimationType.ENTER
                } else {
                    ScreenAnimationDelegate.AnimationType.EXIT
                },
            ),
        )

        animatorSet.addListener(
            object : AnimatorListenerAdapter() {
                override fun onAnimationStart(animation: Animator) {
                    super.onAnimationStart(animation)
                    fadeAnimationRunning = true
                }

                override fun onAnimationEnd(animation: Animator) {
                    super.onAnimationEnd(animation)
                    fadeAnimationRunning = false
                }
            },
        )
    }

    private fun handleKeyboardInsetsProgress(insets: WindowInsetsCompat) {
        lastKeyboardBottomOffset = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
        // Prioritize enter/exit animations over direct keyboard inset reactions.
        // We store the latest keyboard offset in `lastKeyboardBottomOffset`
        // so that it can always be respected when applying translations in `updateScreenTranslation`.
        //
        // This approach allows screen translation to be triggered from two sources, but without messing them together:
        // - During enter/exit animations, while accounting for the keyboard height.
        // - While interacting with a TextInput inside the bottom sheet, to handle keyboard show/hide events.
        if (!fadeAnimationRunning) {
            updateScreenTranslation(0f)
        }
    }

    private fun createBottomSheetBehaviour(): BottomSheetBehavior<Screen> = BottomSheetBehavior<Screen>()

    private fun resolveBackgroundColor(screen: Screen): Int? {
        val screenColor =
            (screen.background as? ColorDrawable?)?.color
                ?: (screen.background as? MaterialShapeDrawable?)?.tintList?.defaultColor

        if (screenColor != null) {
            return screenColor
        }

        val contentWrapper = screen.contentWrapper
        if (contentWrapper == null) {
            return null
        }

        val contentWrapperColor = contentWrapper.resolveBackgroundColor()
        return contentWrapperColor
    }

    private fun attachShapeToScreen(screen: Screen) {
        val cornerSize = max(PixelUtil.toPixelFromDIP(screen.sheetCornerRadius), 0f)
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
        if (!screen.isTranslucent() || screen.headerConfig?.isHeaderHidden == false) {
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

    private fun requireDimmingDelegate(forceCreation: Boolean = false): DimmingViewManager {
        if (dimmingDelegate == null || forceCreation) {
            dimmingDelegate?.invalidate(screen.sheetBehavior)
            dimmingDelegate = DimmingViewManager(screen.reactContext, screen)
        }
        return dimmingDelegate!!
    }

    private fun requireSheetDelegate(): SheetDelegate {
        if (sheetDelegate == null) {
            sheetDelegate = SheetDelegate(screen)
        }
        return sheetDelegate!!
    }
}
