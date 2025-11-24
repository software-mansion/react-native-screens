package com.swmansion.rnscreens

import android.content.Context
import android.graphics.PorterDuff
import android.graphics.PorterDuffColorFilter
import android.text.TextUtils
import android.util.TypedValue
import android.view.Gravity
import android.view.View.OnClickListener
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.text.ReactTypefaceUtils
import com.swmansion.rnscreens.events.HeaderAttachedEvent
import com.swmansion.rnscreens.events.HeaderDetachedEvent
import kotlin.math.max

class ScreenStackHeaderConfig(
    context: Context,
    private val pointerEventsImpl: ReactPointerEventsView,
) : FabricEnabledHeaderConfigViewGroup(context),
    ReactPointerEventsView by pointerEventsImpl {
    constructor(context: Context) : this(context, pointerEventsImpl = PointerEventsBoxNoneImpl())

    private val configSubviews = ArrayList<ScreenStackHeaderSubview>(3)
    val toolbar: CustomToolbar
    var isHeaderHidden = false // named this way to avoid conflict with platform's isHidden
    var isHeaderTranslucent =
        false // named this way to avoid conflict with platform's isTranslucent
    private var title: String? = null
    private var titleColor = 0
    private var titleFontFamily: String? = null
    private var direction: String? = null
    private var titleFontSize = 0f
    private var titleFontWeight = 0
    private var backgroundColor: Int? = null
    private var isBackButtonHidden = false
    private var isShadowHidden = false
    private var isDestroyed = false
    private var backButtonInCustomView = false
    private var tintColor = 0
    private var isAttachedToWindow = false
    private val defaultStartInset: Int
    private val defaultStartInsetWithNavigation: Int
    private val backClickListener =
        OnClickListener {
            screenFragment?.let {
                val stack = screenStack
                if (stack != null && stack.rootScreen == it.screen) {
                    val parentFragment = it.parentFragment
                    if (parentFragment is ScreenStackFragment) {
                        if (parentFragment.screen.nativeBackButtonDismissalEnabled) {
                            parentFragment.dismissFromContainer()
                        } else {
                            parentFragment.dispatchHeaderBackButtonClickedEvent()
                        }
                    }
                } else {
                    if (it.screen.nativeBackButtonDismissalEnabled) {
                        it.dismissFromContainer()
                    } else {
                        it.dispatchHeaderBackButtonClickedEvent()
                    }
                }
            }
        }

    var isTitleEmpty: Boolean = false

    val preferredContentInsetStart
        get() = defaultStartInset

    val preferredContentInsetEnd
        get() = defaultStartInset

    val preferredContentInsetStartWithNavigation
        get() =
            // Reset toolbar insets. By default we set symmetric inset for start and end to match iOS
            // implementation where both right and left icons are offset from the edge by default. We also
            // reset startWithNavigation inset which corresponds to the distance between navigation icon and
            // title. If title isn't set we clear that value few lines below to give more space to custom
            // center-mounted views.
            if (isTitleEmpty) {
                0
            } else {
                defaultStartInsetWithNavigation
            }

    val headerHeightUpdateProxy = ScreenStackHeaderHeightUpdateProxy()

    fun destroy() {
        isDestroyed = true
    }

    /**
     * Native toolbar should notify the header config component that it has completed its layout.
     */
    fun onNativeToolbarLayout(
        toolbar: Toolbar,
        shouldUpdateShadowStateHint: Boolean,
    ) {
        if (!shouldUpdateShadowStateHint) {
            return
        }

        val isBackButtonDisplayed = toolbar.navigationIcon != null

        val contentInsetStartEstimation =
            if (isBackButtonDisplayed) {
                toolbar.currentContentInsetStart + toolbar.paddingStart
            } else {
                max(toolbar.currentContentInsetStart, toolbar.paddingStart)
            }

        // Assuming that there is nothing to the left of back button here, the content
        // offset we're interested in in ShadowTree is the `left` of the subview left.
        // In case it is not available we fallback to approximation.
        val contentInsetStart =
            configSubviews.firstOrNull { it.type === ScreenStackHeaderSubview.Type.LEFT }?.left
                ?: contentInsetStartEstimation

        val contentInsetEnd = toolbar.currentContentInsetEnd + toolbar.paddingEnd

        headerHeightUpdateProxy.updateHeaderHeightIfNeeded(this, screen)

        // Note that implementation of the callee differs between architectures.
        updateHeaderConfigState(
            toolbar.width,
            toolbar.height,
            contentInsetStart,
            contentInsetEnd,
        )
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) = Unit

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        isAttachedToWindow = true
        val surfaceId = UIManagerHelper.getSurfaceId(this)
        UIManagerHelper
            .getEventDispatcherForReactTag(context as ReactContext, id)
            ?.dispatchEvent(HeaderAttachedEvent(surfaceId, id))
        onUpdate()
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        isAttachedToWindow = false
        val surfaceId = UIManagerHelper.getSurfaceId(this)
        UIManagerHelper
            .getEventDispatcherForReactTag(context as ReactContext, id)
            ?.dispatchEvent(HeaderDetachedEvent(surfaceId, id))
    }

    private val screen: Screen?
        get() = parent as? Screen

    private val screenStack: ScreenStack?
        get() = screen?.container as? ScreenStack

    val screenFragment: ScreenStackFragment?
        get() {
            val screen = parent
            if (screen is Screen) {
                val fragment: Fragment? = screen.fragment
                if (fragment is ScreenStackFragment) {
                    return fragment
                }
            }
            return null
        }

    fun onUpdate() {
        val stack = screenStack
        val isTop = stack == null || stack.topScreen == parent

        if (!isAttachedToWindow || !isTop || isDestroyed) {
            return
        }

        val activity = screenFragment?.activity as AppCompatActivity? ?: return
        if (direction != null) {
            if (direction == "rtl") {
                toolbar.layoutDirection = LAYOUT_DIRECTION_RTL
            } else if (direction == "ltr") {
                toolbar.layoutDirection = LAYOUT_DIRECTION_LTR
            }
        }

        // orientation and status bar management
        screen?.let {
            // we set the traits here too, not only when the prop for Screen is passed
            // because sometimes we don't have the Fragment and Activity available then yet, e.g. on the
            // first setting of props. Similar thing is done for Screens of ScreenContainers, but in
            // `onContainerUpdate` of their Fragment
            val reactContext =
                if (context is ReactContext) {
                    context as ReactContext
                } else {
                    it.fragmentWrapper?.tryGetContext()
                }
            ScreenWindowTraits.trySetWindowTraits(it, activity, reactContext)
        }

        if (isHeaderHidden) {
            if (toolbar.parent != null) {
                screenFragment?.removeToolbar()
            }
            headerHeightUpdateProxy.updateHeaderHeightIfNeeded(this, screen)
            return
        }

        if (toolbar.parent == null) {
            screenFragment?.setToolbar(toolbar)
        }

        activity.setSupportActionBar(toolbar)
        // non-null toolbar is set in the line above and it is used here
        val actionBar = requireNotNull(activity.supportActionBar)

        // hide back button
        actionBar.setDisplayHomeAsUpEnabled(
            screenFragment?.canNavigateBack() == true && !isBackButtonHidden,
        )

        // title
        actionBar.title = title
        if (TextUtils.isEmpty(title)) {
            isTitleEmpty = true
        }

        // Reset toolbar insets. By default we set symmetric inset for start and end to match iOS
        // implementation where both right and left icons are offset from the edge by default. We also
        // reset startWithNavigation inset which corresponds to the distance between navigation icon and
        // title. If title isn't set we clear that value few lines below to give more space to custom
        // center-mounted views.
        toolbar.updateContentInsets()

        // when setSupportActionBar is called a toolbar wrapper gets initialized that overwrites
        // navigation click listener. The default behavior set in the wrapper is to call into
        // menu options handlers, but we prefer the back handling logic to stay here instead.
        toolbar.setNavigationOnClickListener(backClickListener)

        // shadow
        screenFragment?.setToolbarShadowHidden(isShadowHidden)

        // translucent
        screenFragment?.setToolbarTranslucent(isHeaderTranslucent)

        val titleTextView = findTitleTextViewInToolbar(toolbar)
        if (titleColor != 0) {
            toolbar.setTitleTextColor(titleColor)
        }

        if (titleTextView != null) {
            if (titleFontFamily != null || titleFontWeight > 0) {
                val titleTypeface =
                    ReactTypefaceUtils.applyStyles(
                        null,
                        0,
                        titleFontWeight,
                        titleFontFamily,
                        context.assets,
                    )
                titleTextView.typeface = titleTypeface
            }
            if (titleFontSize > 0) {
                titleTextView.textSize = titleFontSize
            }
        }

        // background
        backgroundColor?.let { toolbar.setBackgroundColor(it) }

        // color
        if (tintColor != 0) {
            toolbar.navigationIcon?.colorFilter =
                PorterDuffColorFilter(tintColor, PorterDuff.Mode.SRC_ATOP)
        }

        // subviews
        for (i in toolbar.childCount - 1 downTo 0) {
            if (toolbar.getChildAt(i) is ScreenStackHeaderSubview) {
                toolbar.removeViewAt(i)
            }
        }

        var i = 0
        val size = configSubviews.size
        while (i < size) {
            val view = configSubviews[i]
            val type = view.type
            if (type === ScreenStackHeaderSubview.Type.BACK) {
                // we special case BACK button header config type as we don't add it as a view into toolbar
                // but instead just copy the drawable from imageview that's added as a first child to it.
                val firstChild =
                    view.getChildAt(0) as? ImageView
                        ?: throw JSApplicationIllegalArgumentException(
                            "Back button header config view should have Image as first child",
                        )
                actionBar.setHomeAsUpIndicator(firstChild.drawable)
                i++
                continue
            }
            val params = Toolbar.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.MATCH_PARENT)
            when (type) {
                ScreenStackHeaderSubview.Type.LEFT -> {
                    // when there is a left item we need to disable navigation icon by default
                    // we also hide title as there is no other way to display left side items
                    if (!backButtonInCustomView) {
                        toolbar.navigationIcon = null
                    }
                    toolbar.title = null
                    params.gravity = Gravity.START
                }

                ScreenStackHeaderSubview.Type.RIGHT -> params.gravity = Gravity.END
                ScreenStackHeaderSubview.Type.CENTER -> {
                    params.width = LayoutParams.MATCH_PARENT
                    params.gravity = Gravity.CENTER_HORIZONTAL
                    toolbar.title = null
                }

                else -> {}
            }
            view.layoutParams = params
            toolbar.addView(view)
            i++
        }

        headerHeightUpdateProxy.updateHeaderHeightIfNeeded(this, screen)
    }

    private fun maybeUpdate() {
        if (parent != null && !isDestroyed && screen?.isBeingRemoved == false) {
            onUpdate()
        }
    }

    fun getConfigSubview(index: Int): ScreenStackHeaderSubview = configSubviews[index]

    val configSubviewsCount: Int
        get() = configSubviews.size

    fun removeConfigSubview(index: Int) {
        configSubviews.removeAt(index)
        maybeUpdate()
    }

    fun removeAllConfigSubviews() {
        configSubviews.clear()
        maybeUpdate()
    }

    fun addConfigSubview(
        child: ScreenStackHeaderSubview,
        index: Int,
    ) {
        configSubviews.add(index, child)
        maybeUpdate()
    }

    fun setTitle(title: String?) {
        this.title = title
    }

    fun setTitleFontFamily(titleFontFamily: String?) {
        this.titleFontFamily = titleFontFamily
    }

    fun setTitleFontWeight(fontWeightString: String?) {
        titleFontWeight = ReactTypefaceUtils.parseFontWeight(fontWeightString)
    }

    fun setTitleFontSize(titleFontSize: Float) {
        this.titleFontSize = titleFontSize
    }

    fun setTitleColor(color: Int) {
        titleColor = color
    }

    fun setTintColor(color: Int) {
        tintColor = color
    }

    fun setBackgroundColor(color: Int?) {
        backgroundColor = color
    }

    fun setHideShadow(hideShadow: Boolean) {
        isShadowHidden = hideShadow
    }

    fun setHideBackButton(hideBackButton: Boolean) {
        isBackButtonHidden = hideBackButton
    }

    fun setHidden(hidden: Boolean) {
        isHeaderHidden = hidden
    }

    fun setTranslucent(translucent: Boolean) {
        isHeaderTranslucent = translucent
    }

    fun setBackButtonInCustomView(backButtonInCustomView: Boolean) {
        this.backButtonInCustomView = backButtonInCustomView
    }

    fun setDirection(direction: String?) {
        this.direction = direction
    }

    private class DebugMenuToolbar(
        context: Context,
        config: ScreenStackHeaderConfig,
    ) : CustomToolbar(context, config) {
        override fun showOverflowMenu(): Boolean {
            (context.applicationContext as ReactApplication)
                .reactNativeHost
                .reactInstanceManager
                .showDevOptionsDialog()
            return true
        }
    }

    init {
        visibility = GONE
        toolbar =
            if (BuildConfig.DEBUG) DebugMenuToolbar(context, this) else CustomToolbar(context, this)
        defaultStartInset = toolbar.contentInsetStart
        defaultStartInsetWithNavigation = toolbar.contentInsetStartWithNavigation

        // set primary color as background by default
        val tv = TypedValue()
        if (context.theme.resolveAttribute(android.R.attr.colorPrimary, tv, true)) {
            toolbar.setBackgroundColor(tv.data)
        }
        toolbar.clipChildren = false
    }

    companion object {
        fun findTitleTextViewInToolbar(toolbar: Toolbar): TextView? {
            for (i in 0 until toolbar.childCount) {
                val view = toolbar.getChildAt(i)
                if (view is TextView) {
                    if (TextUtils.equals(view.text, toolbar.title)) {
                        return view
                    }
                }
            }
            return null
        }
    }
}
