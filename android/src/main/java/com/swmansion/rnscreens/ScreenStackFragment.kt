package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.TypedArray
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.view.animation.Animation
import android.view.animation.AnimationSet
import android.view.animation.Transformation
import android.widget.LinearLayout
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior
import com.google.android.material.appbar.CollapsingToolbarLayout

class ScreenStackFragment : ScreenFragment, ScreenStackFragmentWrapper {
    private var mAppBarLayout: AppBarLayout? = null
    private var mToolbar: Toolbar? = null
    var mCollapsingToolbarLayout: CollapsingToolbarLayout? = null

    private var mShadowHidden = false
    private var mIsTranslucent = false
    private var mIsToolbarHidden = false

    var searchView: CustomSearchView? = null
    var onSearchViewCreate: ((searchView: CustomSearchView) -> Unit)? = null

    @SuppressLint("ValidFragment")
    constructor(screenView: Screen) : super(screenView)

    constructor() {
        throw IllegalStateException(
            "ScreenStack fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity."
        )
    }

   override fun removeToolbar() {
        mIsToolbarHidden = true

        // Cleanup all views from toolbar and collapsingToolbarLayout
        mToolbar?.removeAllViews()
        mCollapsingToolbarLayout?.removeAllViews()

        mAppBarLayout?.let { appBarLayout ->
            mCollapsingToolbarLayout?.let { collapsingToolbar ->
                if (collapsingToolbar.parent === appBarLayout) {
                    appBarLayout.removeView(collapsingToolbar)
                }
            }

            // As AppBarLayout may have dimensions of expanded medium / large header,
            // We need to change its layout params to `WRAP_CONTENT`.
            appBarLayout.layoutParams = CoordinatorLayout.LayoutParams(
                CoordinatorLayout.LayoutParams.MATCH_PARENT,
                CoordinatorLayout.LayoutParams.WRAP_CONTENT
            )
        }

        mToolbar = null
        mCollapsingToolbarLayout = null
    }

   override fun setToolbar(toolbar: Toolbar) {
        mToolbar = toolbar
        mIsToolbarHidden = false

        if (screen.headerType.isCollapsing) {
            toolbar.layoutParams = CollapsingToolbarLayout.LayoutParams(
                CollapsingToolbarLayout.LayoutParams.MATCH_PARENT,
                R.attr.actionBarSize.resolveAttribute(toolbar.context)
            ).apply {
                collapseMode = CollapsingToolbarLayout.LayoutParams.COLLAPSE_MODE_PIN
            }
        }

        createCollapsingToolbarLayout()
        mCollapsingToolbarLayout?.apply {
            addView(toolbar)
            mAppBarLayout?.addView(this)
        }

        // As `setToolbar` may be called after changing header's visibility,
        // we need to apply correction to layoutParams with proper dimensions.
        mAppBarLayout?.layoutParams = CoordinatorLayout.LayoutParams(
            CoordinatorLayout.LayoutParams.MATCH_PARENT, getHeightOfToolbar(toolbar.context)
        )
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

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: ScreensCoordinatorLayout? =
            context?.let { ScreensCoordinatorLayout(it, this) }

        screen.layoutParams = CoordinatorLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
        ).apply { behavior = if (mIsTranslucent) null else ScrollingViewBehavior() }

        view?.addView(recycleView(screen))

        mAppBarLayout = context?.let { AppBarLayout(it) }?.apply {
            // By default AppBarLayout will have a background color set but since we cover the whole layout
            // with toolbar (that can be semi-transparent) the bar layout background color does not pay a
            // role. On top of that it breaks screens animations when alfa offscreen compositing is off
            // (which is the default)
            setBackgroundColor(Color.TRANSPARENT)

            layoutParams = AppBarLayout.LayoutParams(
                AppBarLayout.LayoutParams.MATCH_PARENT, getHeightOfToolbar(context)
            )

            // On Material 3 the elevation is not visible on AppBarLayout.
            // To prevent this behavior, we're setting outline shadow colors to black.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                outlineAmbientShadowColor = Color.BLACK
                outlineSpotShadowColor = Color.BLACK
            }

            fitsSystemWindows = true
            mCollapsingToolbarLayout?.let {
                addView(recycleView(it))
            }
        }

        mAppBarLayout?.let { view?.addView(it) }

        if (mShadowHidden) {
            mAppBarLayout?.targetElevation = 0f
        }

        setHasOptionsMenu(true)
        return view
    }

    override fun onPrepareOptionsMenu(menu: Menu) {
        updateToolbarMenu(menu)
        return super.onPrepareOptionsMenu(menu)
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        updateToolbarMenu(menu)
        return super.onCreateOptionsMenu(menu, inflater)
    }

    private fun getHeightOfToolbar(context: Context): Int {
        if (mIsToolbarHidden) {
            return CoordinatorLayout.LayoutParams.WRAP_CONTENT
        }

        val resolvedSize = when (screen.headerType) {
            Screen.HeaderType.Medium -> R.attr.collapsingToolbarLayoutMediumSize.resolveAttribute(context)
            Screen.HeaderType.Large -> R.attr.collapsingToolbarLayoutLargeSize.resolveAttribute(context)
            else -> CoordinatorLayout.LayoutParams.WRAP_CONTENT
        }

        // For apps that don't support Material 3 it's possible that resolved attribute of
        // given header type size will return -1. In such case we want to return fallback value of
        // desired header type.
        return when (screen.headerType) {
            Screen.HeaderType.Medium -> if (resolvedSize != -1) resolvedSize else PixelUtil.toPixelFromDIP(112f).toInt()
            Screen.HeaderType.Large -> if (resolvedSize != -1) resolvedSize else PixelUtil.toPixelFromDIP(152f).toInt()
            else -> resolvedSize
        }
    }

    private fun createCollapsingToolbarLayout() {
        val toolbarStyle = when (screen.headerType) {
            Screen.HeaderType.Large -> R.attr.collapsingToolbarLayoutLargeStyle
            Screen.HeaderType.Medium -> R.attr.collapsingToolbarLayoutMediumStyle
            else -> R.attr.collapsingToolbarLayoutStyle
        }

        mCollapsingToolbarLayout = context?.let { CollapsingToolbarLayout(it, null, toolbarStyle) }?.apply {
            layoutParams = AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.MATCH_PARENT)
                .apply {
                    scrollFlags = AppBarLayout.LayoutParams.SCROLL_FLAG_SCROLL or AppBarLayout.LayoutParams.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
                }

            fitsSystemWindows = true
        }
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

    override fun dismiss() {
        val container: ScreenContainer? = screen.container
        check(container is ScreenStack) { "ScreenStackFragment added into a non-stack container" }
        container.dismiss(this)
    }

    private fun Int.resolveAttribute(context: Context): Int {
        val textSizeAttr = intArrayOf(this)
        val indexOfAttrTextSize = 0

        val obtainedAttributesTa: TypedArray = context.obtainStyledAttributes(textSizeAttr)
        val parsedAttribute = obtainedAttributesTa.getDimensionPixelSize(indexOfAttrTextSize, -1)

        obtainedAttributesTa.recycle()
        return parsedAttribute
    }

    private class ScreensCoordinatorLayout(
        context: Context,
        private val mFragment: ScreenFragment
    ) : CoordinatorLayout(context) {
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
    }

    private class ScreensAnimation(private val mFragment: ScreenFragment) : Animation() {
        override fun applyTransformation(interpolatedTime: Float, t: Transformation) {
            super.applyTransformation(interpolatedTime, t)
            // interpolated time should be the progress of the current transition
            mFragment.dispatchTransitionProgressEvent(interpolatedTime, !mFragment.isResumed)
        }
    }
}
