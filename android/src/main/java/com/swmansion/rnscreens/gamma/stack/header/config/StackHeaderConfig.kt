package com.swmansion.rnscreens.gamma.stack.header.config

import android.annotation.SuppressLint
import android.graphics.drawable.Drawable
import android.util.LayoutDirection
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import com.swmansion.rnscreens.gamma.helpers.IconResolver
import com.swmansion.rnscreens.gamma.stack.header.subview.OnStackHeaderSubviewChangeListener
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemIconSource
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarUpdate
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
    private val backButtonIconResolver = IconResolver()

    internal fun resolveBackButtonIconIfNeeded() {
        backButtonIconResolver.resolve(
            reactContext,
            backButtonDrawableIconResourceName,
            backButtonImageIconUri,
        ) { drawable ->
            backButtonIcon = drawable
            notifyConfigChanged()
        }
    }

    internal var toolbarMenuItemIconSourceMap = mapOf<String, StackHeaderToolbarMenuItemIconSource>()

    private var toolbarMenuItemIconResolvers = mapOf<String, IconResolver>()

    internal fun resolveToolbarMenuItemIconsIfNeeded() {
        val nextResolvers = mutableMapOf<String, IconResolver>()

        toolbarMenuItemIconSourceMap.forEach { (id, source) ->
            val resolver = IconResolver()
            nextResolvers[id] = resolver

            resolver.resolve(
                context = reactContext,
                drawableIconResourceName = source.drawableIconResourceName,
                imageIconUri = source.imageIconUri,
            ) { drawable ->

                val currentItems = toolbarMenuItems
                val itemIndex = currentItems.indexOfFirst { it.id == id }

                if (itemIndex != -1) {
                    val item = currentItems[itemIndex]

                    if (item.icon != drawable) {
                        val newItems = currentItems.toMutableList()
                        newItems[itemIndex] = item.copy(icon = drawable)

                        toolbarMenuItems = newItems
                        notifyConfigChanged()
                    }
                }
            }
        }

        toolbarMenuItemIconResolvers = nextResolvers
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
        iconSource: StackHeaderToolbarMenuItemIconSource?,
    ) {
        if (iconSource != null) {
            val resolver = toolbarMenuItemIconResolvers[id]
            if (resolver != null) {
                resolver.resolve(reactContext, iconSource.drawableIconResourceName, iconSource.imageIconUri) { drawable ->
                    delegate?.get()?.onMenuItemUpdate(id, options.copy(icon = StackHeaderToolbarUpdate.from(drawable)))
                }
            } else {
                Log.w(TAG, "[RNScreens] Unable to find icon resolver for menu item $id.")
            }
        } else {
            delegate?.get()?.onMenuItemUpdate(id, options)
        }
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

    companion object {
        private const val TAG = "StackHeaderConfig"
    }
}
