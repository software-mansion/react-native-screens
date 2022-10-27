package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.appcompat.widget.Toolbar
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.uimanager.PixelUtil
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.AppBarLayout.ScrollingViewBehavior
import com.swmansion.common.ScreenStackFragmentCommon
import com.swmansion.rnscreens.sharedElementTransition.SharedElementAnimatorClass

class ScreenStackFragment : ScreenFragment, ScreenStackFragmentCommon {
    private var mAppBarLayout: AppBarLayout? = null
    private var mToolbar: Toolbar? = null
    private var mShadowHidden = false
    private var mIsTranslucent = false

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
        toolbar.layoutParams = AppBarLayout.LayoutParams(
            AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT
        ).apply { scrollFlags = 0 }
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
        screen.headerConfig?.onUpdate()
    }

    override fun onViewAnimationEnd() {
        super.onViewAnimationEnd()
        notifyViewAppearTransitionEnd()
    }

    override fun getFragmentScreen(): View {
        return screen
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
        val view = context?.let {
            SharedElementAnimatorClass.getAnimationCoordinatorLayout(it, this)
        }

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
                AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT
            )
        }

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
            menu.add("").apply {
                setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS)
                actionView = searchView
            }
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
}
