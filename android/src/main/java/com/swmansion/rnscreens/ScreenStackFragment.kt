package com.swmansion.rnscreens

import android.animation.Animator
import android.animation.ValueAnimator
import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.Rect
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.view.animation.Animation
import android.view.animation.AnimationSet
import android.view.animation.AnimationUtils
import android.view.animation.Transformation
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.annotation.RequiresApi
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.touch.ReactHitSlopView
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ReactCompoundViewGroup
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetBehavior.BottomSheetCallback
import com.google.android.material.bottomsheet.BottomSheetDragHandleView
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.MaterialShapeDrawable
import com.google.android.material.shape.ShapeAppearanceModel
import com.swmansion.rnscreens.ext.maybeBgColor
import com.swmansion.rnscreens.ext.recycle
import com.swmansion.rnscreens.utils.DeviceUtils

class ScreenStackFragment : ScreenFragment, ScreenStackFragmentWrapper {
    private var mAppBarLayout: AppBarLayout? = null
    private var mToolbar: Toolbar? = null
    private var mShadowHidden = false
    private var mIsTranslucent = false

    private var mLastFocusedChild: View? = null

    var searchView: CustomSearchView? = null
    var onSearchViewCreate: ((searchView: CustomSearchView) -> Unit)? = null

    private lateinit var coordinatorLayout: ScreensCoordinatorLayout

    private val screenStack: ScreenStack
        get() {
            val container = screen.container
            check(container is ScreenStack) { "ScreenStackFragment added into a non-stack container" }
            return container
        }

    @SuppressLint("ValidFragment")
    constructor(screenView: Screen) : super(screenView)

    constructor() {
        throw IllegalStateException(
            "ScreenStack fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity."
        )
    }

    override fun removeToolbar() {
        mAppBarLayout?.let {
            mToolbar?.let { toolbar ->
                if (toolbar.parent === it) {
                    it.removeView(toolbar)
                }
            }
        }
        mToolbar = null
    }

    override fun setToolbar(toolbar: Toolbar) {
        mAppBarLayout?.addView(toolbar)
        toolbar.layoutParams = AppBarLayout.LayoutParams(
            AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT
        ).apply { scrollFlags = 0 }
        mToolbar = toolbar
    }

    override fun setToolbarShadowHidden(hidden: Boolean) {
        if (mShadowHidden != hidden) {
            mAppBarLayout?.targetElevation = if (hidden) 0f else PixelUtil.toPixelFromDIP(4f)
            mShadowHidden = hidden
        }
    }

    override fun setToolbarTranslucent(translucent: Boolean) {
        if (mIsTranslucent != translucent) {
            val params = screen.layoutParams
            (params as CoordinatorLayout.LayoutParams).behavior =
                if (translucent) null else ScrollingViewBehavior()
            mIsTranslucent = translucent
        }
    }

    override fun onContainerUpdate() {
        super.onContainerUpdate()
        screen.headerConfig?.onUpdate()
    }

    override fun onViewAnimationEnd() {
        super.onViewAnimationEnd()
        notifyViewAppearTransitionEnd()
    }

    private fun notifyViewAppearTransitionEnd() {
        val screenStack = view?.parent
        if (screenStack is ScreenStack) {
            screenStack.onViewAppearTransitionEnd()
        }
    }

    private class AnimateDimmingViewCallback(val screen: Screen, val viewToAnimate: View, initialState: Int) : BottomSheetCallback() {
        private var needsDirectionUpdate = true
        private var transparentColor = Color.argb(0, 0, 0, 0)
        private var dimmedColor = Color.argb(128, 0, 0, 0)
        private var lastStableState: Int = initialState
        private var lastSlideOffset: Float = 0.0F
        private var animDirection: AnimDirection = AnimDirection.UP
        private var animator = ValueAnimator.ofArgb(transparentColor, dimmedColor).apply {
            duration = 1
            addUpdateListener {
                viewToAnimate.setBackgroundColor(it.animatedValue as Int)
            }
        }

        override fun onStateChanged(bottomSheet: View, newState: Int) {
            if (newState == BottomSheetBehavior.STATE_DRAGGING || newState == BottomSheetBehavior.STATE_SETTLING) {
                needsDirectionUpdate = true
            } else {
                lastStableState = newState
            }
        }

        @RequiresApi(Build.VERSION_CODES.LOLLIPOP_MR1)
        override fun onSlide(bottomSheet: View, slideOffset: Float) {
            animDirection = if (slideOffset > lastSlideOffset) AnimDirection.UP else AnimDirection.DOWN
            lastSlideOffset = slideOffset

            if (shouldAnimate()) {
                animator!!.setCurrentFraction(slideOffset)
            }
        }

        private fun createValueAnimator(direction: AnimDirection): ValueAnimator {
            val (startValue, targetValue) = if (direction == AnimDirection.UP) { Pair(viewToAnimate.maybeBgColor()!!, dimmedColor) } else { Pair(viewToAnimate.maybeBgColor()!!, transparentColor) }
            return ValueAnimator.ofArgb(startValue, targetValue).apply {
                duration = 1  // Driven manually
            }
        }

        private fun shouldAnimate(): Boolean {
            return !(isStateLessEqualThan(lastStableState, screen.sheetLargestUndimmedState) && animDirection == AnimDirection.DOWN)
//            return screen.sheetLargestUndimmedState > lastState
        }

        private fun directionFromLastState(): AnimDirection = if (lastStableState != BottomSheetBehavior.STATE_EXPANDED) {
            AnimDirection.UP
        } else {
            AnimDirection.DOWN
        }

        enum class AnimDirection {
            UP, DOWN
        }

        private fun isStateLessEqualThan(state: Int, otherState: Int): Boolean {
            if (state == otherState) {
                return true
            }
            if (state != BottomSheetBehavior.STATE_HALF_EXPANDED && otherState != BottomSheetBehavior.STATE_HALF_EXPANDED) {
                return state > otherState
            }
            if (state == BottomSheetBehavior.STATE_HALF_EXPANDED) {
                return otherState == BottomSheetBehavior.STATE_EXPANDED
            }
            if (state == BottomSheetBehavior.STATE_COLLAPSED) {
                return otherState != BottomSheetBehavior.STATE_HIDDEN
            }
            return false
        }
    }

    private val bottomSheetCallback = object : BottomSheetCallback() {
        override fun onStateChanged(bottomSheet: View, newState: Int) {
            if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                this@ScreenStackFragment.dismissFromContainer()
            }
            Log.i("ScreenStackFragment", "Sheet state changed to $newState")
        }

        override fun onSlide(bottomSheet: View, slideOffset: Float) {
            Log.i("ScreenStackFragment", "onSlide $slideOffset")
        }
    }

    override fun onCreateAnimation(transit: Int, enter: Boolean, nextAnim: Int): Animation? {
        if (screen.stackPresentation != Screen.StackPresentation.FORM_SHEET) {
            return null
        }
        return if (enter) {
            AnimationUtils.loadAnimation(context, R.anim.rns_fade_in)
        } else {
            AnimationUtils.loadAnimation(context, R.anim.rns_fade_out)
        }
//        return super.onCreateAnimation(transit, enter, nextAnim)
    }

    override fun onCreateAnimator(transit: Int, enter: Boolean, nextAnim: Int): Animator? {
        return super.onCreateAnimator(transit, enter, nextAnim)
    }
    
    override fun onStart() {
        mLastFocusedChild?.requestFocus()
        super.onStart()
    }

    override fun onResume() {
        super.onResume()
    }

    internal fun onSheetCornerRadiusChange() {
        (screen.background as MaterialShapeDrawable).shapeAppearanceModel = ShapeAppearanceModel.Builder().apply {
            setTopLeftCorner(CornerFamily.ROUNDED, screen.sheetCornerRadius ?: 0F)
            setTopRightCorner(CornerFamily.ROUNDED, screen.sheetCornerRadius ?: 0F)
        }.build()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        coordinatorLayout = ScreensCoordinatorLayout(requireContext(), this).apply {
            setBackgroundColor(Color.argb(0, 0, 0, 0))
        }

//        screen.layoutParams = CoordinatorLayout.LayoutParams(
//            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
//        ).apply { behavior = if (mIsTranslucent) null else ScrollingViewBehavior() }

        screen.layoutParams = CoordinatorLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
        ).apply {
            behavior = if (screen.stackPresentation == Screen.StackPresentation.FORM_SHEET) {
                BottomSheetBehavior<FrameLayout>().apply {
                    isHideable = true
                    state = BottomSheetBehavior.STATE_COLLAPSED
                    addBottomSheetCallback(bottomSheetCallback)
                    addBottomSheetCallback(AnimateDimmingViewCallback(screen, coordinatorLayout, state))
                    isDraggable = true
                    isFitToContents = false
                    halfExpandedRatio = 0.7F
                    isHideable = true
                    peekHeight = 800
                }
            } else {
                ScrollingViewBehavior()
            }
        }

        screen.clipToOutline = true
        if (screen.stackPresentation == Screen.StackPresentation.FORM_SHEET) {
            attachShapeToScreen(screen)

            if (screen.isSheetGrabberVisible) {
                val grabberView = BottomSheetDragHandleView(requireContext()).apply {
                    layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    )
                }
                coordinatorLayout.addView(grabberView)
            }
        }

//        if (screen.expectsDimmingViewUnderneath()) {
//            coordinatorLayout.setBackgroundColor(Color.argb(128, 0, 0, 0))
//        }

        coordinatorLayout.addView(screen.recycle())

        if (screen.stackPresentation != Screen.StackPresentation.MODAL && screen.stackPresentation != Screen.StackPresentation.FORM_SHEET) {
            mAppBarLayout = context?.let { AppBarLayout(it) }?.apply {
                // By default AppBarLayout will have a background color set but since we cover the whole layout
                // with toolbar (that can be semi-transparent) the bar layout background color does not pay a
                // role. On top of that it breaks screens animations when alfa offscreen compositing is off
                // (which is the default)
                setBackgroundColor(Color.TRANSPARENT)
                layoutParams = AppBarLayout.LayoutParams(
                    AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT
                )
            }


            coordinatorLayout?.addView(mAppBarLayout)
            if (mShadowHidden) {
                mAppBarLayout?.targetElevation = 0f
            }
            mToolbar?.let { mAppBarLayout?.addView(it.recycle()) }
            setHasOptionsMenu(true)
        }
        return coordinatorLayout
    }

    fun addDimmingViewOnTop() {
        val coordinator = screen.parent as ScreensCoordinatorLayout
        val dimmingView = createDimmingView()
        coordinator.addView(dimmingView)
    }

    fun removeDimmingViewFromTop() {
        val coordinator = screen.parent as ScreensCoordinatorLayout
        coordinator.removeViewAt(coordinator.childCount - 1)
    }

    private fun createDimmingView(): View {
        return View(requireContext()).apply {
            layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.argb(120, 0, 0, 0))
        }
    }

    private fun attachShapeToScreen(screen: Screen) {
        val shapeAppearanceModel = ShapeAppearanceModel.Builder().apply {
            setTopLeftCorner(CornerFamily.ROUNDED, screen.sheetCornerRadius ?: 0F)
            setTopRightCorner(CornerFamily.ROUNDED, screen.sheetCornerRadius ?: 0F)
        }.build()
        val shape = MaterialShapeDrawable(shapeAppearanceModel)
        screen.background = shape;
    }

    override fun onStop() {
        if (DeviceUtils.isPlatformAndroidTV(context))
            mLastFocusedChild = findLastFocusedChild()

        super.onStop()
    }

    override fun onPrepareOptionsMenu(menu: Menu) {
        updateToolbarMenu(menu)
        return super.onPrepareOptionsMenu(menu)
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
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
        private val mFragment: ScreenStackFragment
    ) : CoordinatorLayout(context), ReactCompoundViewGroup, ReactHitSlopView {
        private val mAnimationListener: Animation.AnimationListener =
            object : Animation.AnimationListener {
                override fun onAnimationStart(animation: Animation) {
                    mFragment.onViewAnimationStart()
                }

                override fun onAnimationEnd(animation: Animation) {
                    mFragment.onViewAnimationEnd()
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
            val fakeAnimation = ScreensAnimation(mFragment).apply { duration = animation.duration }

            if (mFragment.screen.stackPresentation == Screen.StackPresentation.FORM_SHEET && mFragment.isAdded) {
                this.clearAnimation()
                mFragment.screen.clearAnimation()
            }

            if (animation is AnimationSet && !mFragment.isRemoving) {
                animation.apply {
                    addAnimation(fakeAnimation)
                    setAnimationListener(mAnimationListener)
                }.also {
                    super.startAnimation(it)
                }
            } else {
                AnimationSet(true).apply {
                    addAnimation(animation)
                    addAnimation(fakeAnimation)
                    setAnimationListener(mAnimationListener)
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

        override fun reactTagForTouch(touchX: Float, touchY: Float): Int {
            throw IllegalStateException("Screen wrapper should never be asked for the view tag")
        }

        override fun interceptsTouchEvent(touchX: Float, touchY: Float): Boolean {
            return false
        }

        override fun getHitSlopRect(): Rect? {
            val screen: Screen = mFragment.screen
//            left – The X coordinate of the left side of the rectangle
//            top – The Y coordinate of the top of the rectangle i
//            right – The X coordinate of the right side of the rectangle
//            bottom – The Y coordinate of the bottom of the rectangle
            return Rect(screen.x.toInt(), -screen.y.toInt(), screen.x.toInt() + screen.width, screen.y.toInt() + screen.height)
        }
    }

    private class ScreensAnimation(private val mFragment: ScreenFragment) : Animation() {
        override fun applyTransformation(interpolatedTime: Float, t: Transformation) {
            super.applyTransformation(interpolatedTime, t)
            // interpolated time should be the progress of the current transition
            mFragment.dispatchTransitionProgressEvent(interpolatedTime, !mFragment.isResumed)
        }
    }
}
