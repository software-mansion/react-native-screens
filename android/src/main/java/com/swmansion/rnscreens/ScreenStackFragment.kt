package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.*
import android.view.animation.Animation
import android.view.animation.AnimationSet
import android.view.animation.Transformation
import android.widget.LinearLayout
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior

class ScreenStackFragment : ScreenFragment {
    private var mAppBarLayout: AppBarLayout? = null
    private var mToolbar: Toolbar? = null
    private var mShadowHidden = false
    private var mIsTranslucent = false
    val parentViews: MutableList<ViewGroup> = mutableListOf()
    val transitionContainer: CoordinatorLayout = ReanimatedCoordinatorLayout(screen.context)
    var shouldPerformSET = false
    var sharedElements: List<Pair<View, View>> = ArrayList()

    var searchView: CustomSearchView? = null
    var onSearchViewCreate: ((searchView: CustomSearchView) -> Unit)? = null

    @SuppressLint("ValidFragment")
    constructor(screenView: Screen) : super(screenView)

    constructor() {
        throw IllegalStateException(
            "ScreenStack fragments should never be restored. Follow instructions from https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067 to properly configure your main activity."
        )
    }

    fun removeToolbar() {
        mAppBarLayout?.let {
            mToolbar?.let { toolbar ->
                if (toolbar.parent === it) {
                    it.removeView(toolbar)
                }
            }
        }
        mToolbar = null
    }

    fun setToolbar(toolbar: Toolbar) {
        mAppBarLayout?.addView(toolbar)
        val params = AppBarLayout.LayoutParams(
            AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT
        )
        params.scrollFlags = 0
        toolbar.layoutParams = params
        mToolbar = toolbar
    }

    fun setToolbarShadowHidden(hidden: Boolean) {
        if (mShadowHidden != hidden) {
            mAppBarLayout?.targetElevation = if (hidden) 0f else PixelUtil.toPixelFromDIP(4f)
            mShadowHidden = hidden
        }
    }

    fun setToolbarTranslucent(translucent: Boolean) {
        if (mIsTranslucent != translucent) {
            val params = screen.layoutParams
            (params as CoordinatorLayout.LayoutParams).behavior =
                if (translucent) null else ScrollingViewBehavior()
            mIsTranslucent = translucent
        }
    }

    override fun onContainerUpdate() {
        val headerConfig = screen.headerConfig
        headerConfig?.onUpdate()
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
        val params = CoordinatorLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT
        )
        params.behavior = if (mIsTranslucent) null else ScrollingViewBehavior()
        screen.layoutParams = params
        view?.addView(recycleView(screen))

        mAppBarLayout = context?.let { AppBarLayout(it) }
        // By default AppBarLayout will have a background color set but since we cover the whole layout
        // with toolbar (that can be semi-transparent) the bar layout background color does not pay a
        // role. On top of that it breaks screens animations when alfa offscreen compositing is off
        // (which is the default)
        mAppBarLayout?.setBackgroundColor(Color.TRANSPARENT)
        mAppBarLayout?.layoutParams = AppBarLayout.LayoutParams(
            AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT
        )
        view?.addView(mAppBarLayout)
        if (mShadowHidden) {
            mAppBarLayout?.targetElevation = 0f
        }
        mToolbar?.let { mAppBarLayout?.addView(recycleView(it)) }
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
            val item = menu.add("")
            item.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS)
            item.actionView = searchView
        }
    }

    fun canNavigateBack(): Boolean {
        val container: ScreenContainer<*>? = screen.container
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

    fun dismiss() {
        val container: ScreenContainer<*>? = screen.container
        check(container is ScreenStack) { "ScreenStackFragment added into a non-stack container" }
        container.dismiss(this)
    }

    private class ReanimatedCoordinatorLayout(context: Context) : CoordinatorLayout(context) {
        override fun onMeasureChild(
            child: View?, parentWidthMeasureSpec: Int, widthUsed: Int,
            parentHeightMeasureSpec: Int, heightUsed: Int
        ) {
            /* we want to prevent `measure` on shared element transition item
               because it breaks the first couple frames of animation */
        }

        override fun onLayoutChild(child: View, layoutDirection: Int) {
            /* we want to prevent `layout` on shared element transition item
               because it breaks the first couple frames of animation */
        }
    }

    private class ScreensCoordinatorLayout(context: Context, private val mFragment: ScreenStackFragment) : CoordinatorLayout(context) {

        override fun onAttachedToWindow() {
            super.onAttachedToWindow()
            if (mFragment.shouldPerformSET) {
                val rootView = mFragment.tryGetActivity()?.window?.decorView?.rootView as ViewGroup
                rootView.addView(mFragment.transitionContainer)
            }
        }

        override fun onDetachedFromWindow() {
            super.onDetachedFromWindow()
//            // removal of view has to be postponed on after the end of animation.
//            // More information and used code here:
//            // https://stackoverflow.com/questions/33242776/android-viewgroup-crash-attempt-to-read-from-field-int-android-view-view-mview
//            Handler(Looper.getMainLooper()).post {
                val rootView = mFragment.tryGetActivity()?.window?.decorView?.rootView
                if (mFragment.transitionContainer.parent == rootView) {
                    (rootView as ViewGroup).removeView(
                        mFragment.transitionContainer)
                }
//            }
        }

        private val mAnimationListener: Animation.AnimationListener = object : Animation.AnimationListener {
            override fun onAnimationStart(animation: Animation) {
                mFragment.onViewAnimationStart()
                val activity = mFragment.tryGetActivity()
                if (mFragment.shouldPerformSET && activity != null && mFragment.transitionContainer.parent != null) {
                    val delegate = SharedElementAnimatorClass.getDelegate()
//                    var statusBarHeight = 0
//                    val resourceId = Resources.getSystem().getIdentifier("status_bar_height", "dimen", "android");
//                    if (resourceId > 0) {
//                      statusBarHeight = Resources.getSystem().getDimensionPixelSize(resourceId);
//                    }
                    val transitionContainer = mFragment.transitionContainer
//                    (transitionContainer as ReanimatedCoordinatorLayout).mleko()
//                    mFragment.transitionContainer.setPadding(
//                        transitionContainer.paddingLeft,
//                        statusBarHeight, // TODO: backup value
//                        transitionContainer.paddingRight,
//                        transitionContainer.paddingBottom
//                    )
                    mFragment.sharedElements.forEach { pair ->
                        val fromView = pair.first
                        val toView = pair.second
                        delegate?.makeSnapshot(fromView)
                        delegate?.makeSnapshot(toView)
                        fromView.visibility = View.INVISIBLE
                        val toViewParent = toView.parent as ViewGroup
                        toViewParent.removeView(toView)
                        mFragment.parentViews.add(toViewParent)
                        mFragment.transitionContainer.addView(toView)
                        delegate?.runTransition(fromView, toView)
                    }
                }
            }

            override fun onAnimationEnd(animation: Animation) {
                mFragment.onViewAnimationEnd()
//                val transitionContainer = mFragment.transitionContainer
//                mFragment.transitionContainer.setPadding(
//                    transitionContainer.paddingLeft,
//                    0, // TODO: restore value from backup
//                    transitionContainer.paddingRight,
//                    transitionContainer.paddingBottom
//                )
                if (mFragment.shouldPerformSET && mFragment.transitionContainer.parent != null) {
                    mFragment.sharedElements.forEach { pair ->
                        val fromView = pair.first
                        val toView = pair.second
                        fromView.visibility = View.VISIBLE
                        mFragment.transitionContainer.removeView(toView)
                        mFragment.parentViews[0].addView(toView)
                        mFragment.parentViews.removeAt(0)
                    }
                    val delegate = SharedElementAnimatorClass.getDelegate()
                    delegate?.onNativeAnimationEnd(mFragment.screen)
                    mFragment.shouldPerformSET = false
                }
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
            val fakeAnimation = ScreensAnimation(mFragment)
            animation.duration = 2000
            fakeAnimation.duration = animation.duration
            if (animation is AnimationSet && !mFragment.isRemoving) {
                animation.addAnimation(fakeAnimation)
                animation.setAnimationListener(mAnimationListener)
                super.startAnimation(animation)
            } else {
                val set = AnimationSet(true)
                set.addAnimation(animation)
                set.addAnimation(fakeAnimation)
                set.setAnimationListener(mAnimationListener)
                super.startAnimation(set)
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
            mFragment.dispatchTransitionProgress(interpolatedTime, !mFragment.isResumed)
        }
    }
}
