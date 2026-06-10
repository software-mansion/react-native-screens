package com.swmansion.rnscreens.gamma.stack.header.config

import android.annotation.SuppressLint
import android.graphics.drawable.Drawable
import android.util.LayoutDirection
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.helpers.getFabricUIManagerNotNull
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import com.swmansion.rnscreens.gamma.helpers.IconResolution
import com.swmansion.rnscreens.gamma.helpers.IconResolver
import com.swmansion.rnscreens.gamma.stack.header.subview.OnStackHeaderSubviewChangeListener
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemIconSource
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarUpdate
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor")
class StackHeaderConfig(
    val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderConfigurationProviding,
    StackHeaderDelegate,
    OnStackHeaderSubviewChangeListener,
    UIManagerListener {

    // region Flag accumulation

    private var pendingFlags = StackHeaderUpdateFlags.NONE
    private var isInsideMountTransaction = false
    private var configObserver: StackHeaderConfigurationObserver? = null

    override fun setConfigurationObserver(observer: StackHeaderConfigurationObserver?) {
        configObserver = observer
    }

    private fun invalidate(flags: StackHeaderUpdateFlags) {
        pendingFlags = pendingFlags or flags
    }

    private fun flushUpdates() {
        if (configObserver == null || pendingFlags.isEmpty) {
            return
        }

        val snapshot = pendingFlags
        configObserver?.onConfigChanged(this, snapshot)
        pendingFlags = StackHeaderUpdateFlags.NONE
    }

    // endregion

    // region UIManagerListener

    init {
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .addUIManagerEventListener(this)
    }

    override fun willMountItems(uiManager: UIManager) {
        isInsideMountTransaction = true
    }

    override fun didMountItems(uiManager: UIManager) {
        isInsideMountTransaction = false
        flushUpdates()
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    // endregion

    // region Properties

    override var type: StackHeaderType by Delegates.observable(StackHeaderType.SMALL) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.STRUCTURE)
    }
        internal set

    override var title: String by Delegates.observable("") { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.TITLE)
    }
        internal set

    override var hidden: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.STRUCTURE)
    }
        internal set

    override var transparent: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.STRUCTURE)
    }
        internal set

    override var backButtonHidden: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonTintColorNormal: Int? by Delegates.observable(null) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonTintColorPressed: Int? by Delegates.observable(null) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonTintColorFocused: Int? by Delegates.observable(null) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonIcon: Drawable? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderUpdateFlags.BACK_BUTTON)
    }
        internal set

    override var scrollFlagScroll: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagEnterAlways: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagEnterAlwaysCollapsed: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagExitUntilCollapsed: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagSnap: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderUpdateFlags.SCROLL_FLAGS)
    }
        internal set

    override var toolbarMenuItems: List<StackHeaderToolbarMenuItemConfig>
        by Delegates.observable(emptyList()) { _, old, new ->
            if (old != new) invalidate(StackHeaderUpdateFlags.TOOLBAR_MENU)
        }
        internal set

    override val isRTL: Boolean
        get() = layoutDirection == LayoutDirection.RTL

    // endregion

    // region Back button icon resolution

    internal var backButtonDrawableIconResourceName: String? = null
    internal var backButtonImageIconUri: String? = null
    private val backButtonIconResolver = IconResolver()

    internal fun resolveBackButtonIconIfNeeded() {
        backButtonIconResolver.resolve(
            reactContext,
            backButtonDrawableIconResourceName,
            backButtonImageIconUri,
        ) { result ->
            when (result) {
                IconResolution.Unchanged -> Unit
                is IconResolution.Resolved -> {
                    backButtonIcon = result.drawable
                    if (!isInsideMountTransaction) {
                        flushUpdates()
                    }
                }
            }
        }
    }

    // endregion

    // region Toolbar menu item icon resolution

    internal var toolbarMenuItemIconSourceMap = mapOf<String, StackHeaderToolbarMenuItemIconSource>()

    private var toolbarMenuItemIconResolvers = mapOf<String, IconResolver>()

    private var toolbarMenuItemIcons = mapOf<String, Drawable?>()

    internal fun resolveToolbarMenuItemIconsIfNeeded() {
        val nextResolvers = mutableMapOf<String, IconResolver>()

        toolbarMenuItemIconSourceMap.forEach { (id, source) ->
            val resolver = toolbarMenuItemIconResolvers[id] ?: IconResolver()
            nextResolvers[id] = resolver

            resolver.resolve(
                context = reactContext,
                drawableIconResourceName = source.drawableIconResourceName,
                imageIconUri = source.imageIconUri,
            ) { result ->
                val icon =
                    when (result) {
                        IconResolution.Unchanged -> toolbarMenuItemIcons[id]
                        is IconResolution.Resolved -> {
                            toolbarMenuItemIcons = toolbarMenuItemIcons + (id to result.drawable)
                            result.drawable
                        }
                    }

                applyToolbarMenuItemIcon(id, icon)
            }
        }

        toolbarMenuItemIconResolvers = nextResolvers
        toolbarMenuItemIcons = toolbarMenuItemIcons.filterKeys { it in toolbarMenuItemIconSourceMap }
    }

    private fun applyToolbarMenuItemIcon(
        id: String,
        icon: Drawable?,
    ) {
        val currentItems = toolbarMenuItems
        val itemIndex = currentItems.indexOfFirst { it.id == id }
        if (itemIndex == -1) return

        val item = currentItems[itemIndex]
        if (item.icon != icon) {
            val newItems = currentItems.toMutableList()
            newItems[itemIndex] = item.copy(icon = icon)
            toolbarMenuItems = newItems
            if (!isInsideMountTransaction) {
                flushUpdates()
            }
        }
    }

    // endregion

    // region Subviews

    override var backgroundSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderUpdateFlags.SUBVIEWS)
    }
        private set

    override var leadingSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderUpdateFlags.SUBVIEWS)
    }
        private set

    override var centerSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderUpdateFlags.SUBVIEWS)
    }
        private set

    override var trailingSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderUpdateFlags.SUBVIEWS)
    }
        private set

    // endregion

    // region Shadow state (StackHeaderDelegate)

    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

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

    override fun onMenuItemClick(id: String) {
        eventEmitter.emitOnToolbarMenuItemClicked(id)
    }

    // endregion

    // region Event emitter

    internal lateinit var eventEmitter: StackHeaderConfigEventEmitter

    internal fun onViewManagerAddEventEmitters() {
        check(id != NO_ID) { "[RNScreens] StackHeaderConfig must have its tag set when registering event emitters" }
        eventEmitter = StackHeaderConfigEventEmitter(reactContext, id)
    }

    // endregion

    // region Imperative menu item commands

    internal fun dispatchMenuItemUpdate(
        id: String,
        options: StackHeaderToolbarMenuItemOptions,
        iconSource: StackHeaderToolbarMenuItemIconSource?,
    ) {
        if (iconSource == null) {
            configObserver?.onMenuItemUpdate(id, options)
            return
        }

        val resolver = toolbarMenuItemIconResolvers[id]
        if (resolver == null) {
            Log.w(TAG, "[RNScreens] Unable to find icon resolver for menu item $id.")
            configObserver?.onMenuItemUpdate(id, options)
            return
        }

        resolver.resolve(reactContext, iconSource.drawableIconResourceName, iconSource.imageIconUri) { result ->
            val icon =
                when (result) {
                    IconResolution.Unchanged -> null
                    is IconResolution.Resolved -> {
                        toolbarMenuItemIcons = toolbarMenuItemIcons + (id to result.drawable)
                        StackHeaderToolbarUpdate.from(result.drawable)
                    }
                }
            configObserver?.onMenuItemUpdate(id, options.copy(icon = icon))
        }
    }

    // endregion

    // region Subview management

    override fun onStackHeaderSubviewChange() {
        invalidate(StackHeaderUpdateFlags.SUBVIEWS)
    }

    internal fun addConfigSubview(headerSubview: StackHeaderSubview) {
        when (headerSubview.type) {
            StackHeaderSubviewType.BACKGROUND -> backgroundSubview = headerSubview
            StackHeaderSubviewType.LEADING -> leadingSubview = headerSubview
            StackHeaderSubviewType.CENTER -> centerSubview = headerSubview
            StackHeaderSubviewType.TRAILING -> trailingSubview = headerSubview
        }
        headerSubview.onStackHeaderSubviewChangeListener = WeakReference(this)
    }

    internal fun removeConfigSubview(headerSubview: StackHeaderSubview) {
        headerSubview.onStackHeaderSubviewChangeListener = null
        when (headerSubview.type) {
            StackHeaderSubviewType.BACKGROUND -> backgroundSubview = null
            StackHeaderSubviewType.LEADING -> leadingSubview = null
            StackHeaderSubviewType.CENTER -> centerSubview = null
            StackHeaderSubviewType.TRAILING -> trailingSubview = null
        }
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

    internal fun getConfigSubviewAt(index: Int): StackHeaderSubview? =
        listOfNotNull(backgroundSubview, leadingSubview, centerSubview, trailingSubview).getOrNull(index)

    // endregion

    // region Teardown

    internal fun tearDown() {
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .removeUIManagerEventListener(this)
        pendingFlags = StackHeaderUpdateFlags.NONE
        configObserver = null
    }

    // endregion

    companion object {
        private const val TAG = "StackHeaderConfig"
    }
}
