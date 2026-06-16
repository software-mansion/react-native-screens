package com.swmansion.rnscreens.gamma.stack.header.config

import android.annotation.SuppressLint
import android.graphics.drawable.Drawable
import android.util.LayoutDirection
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import com.swmansion.rnscreens.gamma.helpers.getSystemDrawableResource
import com.swmansion.rnscreens.gamma.helpers.loadImage
import com.swmansion.rnscreens.gamma.stack.header.subview.OnStackHeaderSubviewChangeListener
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor")
class StackHeaderConfig(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderConfigProviding,
    OnStackHeaderSubviewChangeListener {
    override var type: StackHeaderType = StackHeaderType.SMALL
        internal set
    override var title: String = ""
        internal set
    override var hidden: Boolean = false
        internal set
    override var transparent: Boolean = false
        internal set
    override var backButtonHidden: Boolean = false
        internal set
    override var backButtonTintColor: Int? = null
        internal set
    override var backButtonIcon: Drawable? = null
        internal set

    override var scrollFlagScroll: Boolean = false
        internal set
    override var scrollFlagEnterAlways: Boolean = false
        internal set
    override var scrollFlagEnterAlwaysCollapsed: Boolean = false
        internal set
    override var scrollFlagExitUntilCollapsed: Boolean = false
        internal set
    override var scrollFlagSnap: Boolean = false
        internal set

    override var toolbarMenuItems: List<StackHeaderToolbarMenuItemConfig> = emptyList()
        internal set

    // Staging fields for back button icon resolution.
    // Both props may arrive in any order within a single update batch.
    // Resolution happens in resolveBackButtonIconIfNeeded(), called from onAfterUpdateTransaction.
    internal var backButtonDrawableIconResourceName: String? = null
    internal var backButtonImageIconUri: String? = null

    private var lastResolvedDrawableIconResourceName: String? = null
    private var lastResolvedImageIconUri: String? = null

    internal fun resolveBackButtonIconIfNeeded() {
        val name = backButtonDrawableIconResourceName
        val uri = backButtonImageIconUri

        if (name == lastResolvedDrawableIconResourceName && uri == lastResolvedImageIconUri) {
            return
        }

        lastResolvedDrawableIconResourceName = name
        lastResolvedImageIconUri = uri

        if (name != null) {
            backButtonIcon = getSystemDrawableResource(context, name)
        } else if (uri != null) {
            loadImage(context, uri) { drawable ->
                if (uri == lastResolvedImageIconUri) {
                    backButtonIcon = drawable
                    // We need to call notifyConfigChanged because icons are loaded asynchronously
                    // and regular update path might execute too early.
                    notifyConfigChanged()
                }
            }
        } else {
            backButtonIcon = null
        }
    }

    override var backgroundSubview: StackHeaderSubview? = null
        private set
    override var leadingSubview: StackHeaderSubview? = null
        private set
    override var centerSubview: StackHeaderSubview? = null
        private set
    override var trailingSubview: StackHeaderSubview? = null
        private set

    override val isRTL: Boolean
        get() = layoutDirection == LayoutDirection.RTL

    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

    internal lateinit var eventEmitter: StackHeaderConfigEventEmitter

    private var delegate: WeakReference<StackHeaderConfigDelegate>? = null

    override fun updateHeaderFrame(
        width: Int,
        height: Int,
        contentOffsetY: Int,
    ) {
        shadowStateProxy.updateStateIfNeeded(
            density = resources.displayMetrics.density,
            frameWidth = width,
            frameHeight = height,
            contentOffsetY = contentOffsetY,
        )
    }

    internal fun onViewManagerAddEventEmitters() {
        check(id != NO_ID) { "[RNScreens] StackHeaderConfig must have its tag set when registering event emitters" }
        eventEmitter = StackHeaderConfigEventEmitter(reactContext, id)
    }

    override fun onMenuItemClick(id: String) {
        eventEmitter.emitOnToolbarMenuItemClicked(id)
    }

    override fun setDelegate(delegate: StackHeaderConfigDelegate) {
        this.delegate = WeakReference(delegate)
    }

    override fun removeDelegate(delegate: StackHeaderConfigDelegate) {
        if (this.delegate?.get() === delegate) {
            this.delegate = null
        }
    }

    internal fun notifyConfigChanged() {
        delegate?.get()?.onConfigChange(this)
    }

    internal fun dispatchMenuItemUpdate(
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
    ) {
        delegate?.get()?.onMenuItemUpdate(id, options)
    }

    override fun onStackHeaderSubviewChange() = notifyConfigChanged()

    internal fun addConfigSubview(headerSubview: StackHeaderSubview) {
        when (headerSubview.type) {
            StackHeaderSubviewType.BACKGROUND -> backgroundSubview = headerSubview
            StackHeaderSubviewType.LEADING -> leadingSubview = headerSubview
            StackHeaderSubviewType.CENTER -> centerSubview = headerSubview
            StackHeaderSubviewType.TRAILING -> trailingSubview = headerSubview
        }
        headerSubview.onStackHeaderSubviewChangeListener = WeakReference(this)
        notifyConfigChanged()
    }

    internal fun removeConfigSubview(headerSubview: StackHeaderSubview) {
        headerSubview.onStackHeaderSubviewChangeListener = null
        when (headerSubview.type) {
            StackHeaderSubviewType.BACKGROUND -> backgroundSubview = null
            StackHeaderSubviewType.LEADING -> leadingSubview = null
            StackHeaderSubviewType.CENTER -> centerSubview = null
            StackHeaderSubviewType.TRAILING -> trailingSubview = null
        }
        notifyConfigChanged()
    }

    internal fun removeConfigSubviewAt(index: Int) {
        getConfigSubviewAt(index)?.let { removeConfigSubview(it) }
    }

    internal fun removeAllConfigSubviews() {
        backgroundSubview?.let { removeConfigSubview(it) }
        leadingSubview?.let { removeConfigSubview(it) }
        centerSubview?.let { removeConfigSubview(it) }
        trailingSubview?.let { removeConfigSubview(it) }
    }

    internal val configSubviewsCount: Int
        get() = listOfNotNull(backgroundSubview, leadingSubview, centerSubview, trailingSubview).size

    // The order of the subviews MUST match the order of JS StackHeaderConfig children.
    internal fun getConfigSubviewAt(index: Int): StackHeaderSubview? =
        listOfNotNull(backgroundSubview, leadingSubview, centerSubview, trailingSubview).getOrNull(index)
}
