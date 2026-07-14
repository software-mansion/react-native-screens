package com.swmansion.rnscreens.gamma.stack.header.config

import android.annotation.SuppressLint
import android.graphics.drawable.Drawable
import android.util.LayoutDirection
import android.util.Log
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import com.swmansion.rnscreens.gamma.helpers.IconResolution
import com.swmansion.rnscreens.gamma.helpers.IconResolver
import com.swmansion.rnscreens.gamma.helpers.getFabricUIManagerNotNull
import com.swmansion.rnscreens.gamma.stack.header.subview.OnStackHeaderSubviewChangeListener
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarFieldUpdate
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuElementRawUpdate
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuIconResolver
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemIconSource
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuUpdateQueue
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor")
internal class StackHeaderConfig(
    val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderConfigurationProviding,
    StackHeaderDelegate,
    OnStackHeaderSubviewChangeListener,
    UIManagerListener {
    init {
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .addUIManagerEventListener(this)
    }

    // region Handling configuration changes

    private var configObserver: StackHeaderConfigurationObserver? = null

    override fun setConfigurationObserver(observer: StackHeaderConfigurationObserver?) {
        configObserver = observer
    }

    override var invalidationFlags = StackHeaderInvalidationFlags.ALL

    override fun clearInvalidationFlags(flags: StackHeaderInvalidationFlags) {
        invalidationFlags = invalidationFlags.clearing(flags)
    }

    private fun invalidate(flags: StackHeaderInvalidationFlags) {
        invalidationFlags = invalidationFlags or flags
    }

    private fun flushUpdates() {
        if (configObserver == null || invalidationFlags.isEmpty) {
            return
        }

        configObserver?.onConfigChanged(this)
    }

    // endregion

    // region Properties

    override var type: StackHeaderType by Delegates.observable(StackHeaderType.SMALL) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.STRUCTURE)
    }
        internal set

    override var title: String by Delegates.observable("") { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.TITLE)
    }
        internal set

    override var hidden: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.STRUCTURE)
    }
        internal set

    override var transparent: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.STRUCTURE)
    }
        internal set

    override var backButtonHidden: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonTintColorNormal: Int? by Delegates.observable(null) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonTintColorPressed: Int? by Delegates.observable(null) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonTintColorFocused: Int? by Delegates.observable(null) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.BACK_BUTTON)
    }
        internal set

    override var backButtonIcon: Drawable? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderInvalidationFlags.BACK_BUTTON)
    }
        internal set

    override var scrollFlagScroll: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagEnterAlways: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagEnterAlwaysCollapsed: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagExitUntilCollapsed: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.SCROLL_FLAGS)
    }
        internal set

    override var scrollFlagSnap: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.SCROLL_FLAGS)
    }
        internal set

    override var toolbarMenu: StackHeaderToolbarMenuConfig
        by Delegates.observable(StackHeaderToolbarMenuConfig(emptyList(), emptyList())) { _, old, new ->
            if (old != new) invalidate(StackHeaderInvalidationFlags.TOOLBAR_MENU)
        }
        internal set

    override var toolbarMenuGroupDividerEnabled: Boolean by Delegates.observable(false) { _, old, new ->
        if (old != new) invalidate(StackHeaderInvalidationFlags.TOOLBAR_MENU)
    }
        internal set

    override val isRTL: Boolean
        get() = layoutDirection == LayoutDirection.RTL

    // endregion

    // region Back button icon resolution

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

    // Last resolved icon per menu item id. Unlike every other field on this config — which
    // mirrors a single prop — this cache deliberately merges resolved icons from BOTH sources
    // that can set a menu item icon: the `toolbarMenu` prop
    // (resolveToolbarMenuItemIconsIfNeeded) and the imperative `updateToolbarMenuElements`
    // view command (commandIconResolver). It is necessary to ensure consistency.
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
        val currentMenu = toolbarMenu
        val updated = currentMenu.updateItemIcon(id, icon)
        if (updated !== currentMenu) {
            toolbarMenu = updated
            if (!isInsideMountTransaction) {
                flushUpdates()
            }
        }
    }

    // endregion

    // region Subviews

    override var backgroundSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderInvalidationFlags.SUBVIEWS)
    }
        private set

    override var leadingSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderInvalidationFlags.SUBVIEWS)
    }
        private set

    override var centerSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderInvalidationFlags.SUBVIEWS)
    }
        private set

    override var trailingSubview: StackHeaderSubview? by Delegates.observable(null) { _, old, new ->
        if (old !== new) invalidate(StackHeaderInvalidationFlags.SUBVIEWS)
    }
        private set

    override fun onStackHeaderSubviewChanged() {
        invalidate(StackHeaderInvalidationFlags.SUBVIEWS)
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
        get() = getListOfSubviews().size

    internal fun getConfigSubviewAt(index: Int): StackHeaderSubview? = getListOfSubviews().getOrNull(index)

    private fun getListOfSubviews() = listOfNotNull(backgroundSubview, leadingSubview, centerSubview, trailingSubview)

    // endregion

    // region StackHeaderDelegate & Shadow state synchronization

    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

    override fun onHeaderFrameChanged(
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

    override fun onMenuItemClicked(id: String) {
        eventEmitter.emitOnToolbarMenuItemPress(id)
    }

    override fun onGroupSelectionChanged(
        groupId: String,
        selectedIds: List<String>,
    ) {
        eventEmitter.emitOnToolbarMenuGroupSelectionChange(groupId, selectedIds)
    }

    override fun onSubviewOriginChanged(
        type: StackHeaderSubviewType,
        x: Int,
        y: Int,
    ) {
        val subview =
            when (type) {
                StackHeaderSubviewType.BACKGROUND -> backgroundSubview
                StackHeaderSubviewType.LEADING -> leadingSubview
                StackHeaderSubviewType.CENTER -> centerSubview
                StackHeaderSubviewType.TRAILING -> trailingSubview
            }
        subview?.updateContentOriginOffset(x, y)
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

    // Resolves a single command's icon, reusing the same per-id [IconResolver] and shared
    // icon cache as the `toolbarMenu` prop path (see [toolbarMenuItemIcons]).
    private val commandIconResolver =
        StackHeaderToolbarMenuIconResolver { id, iconSource, onResolved ->
            val resolver = toolbarMenuItemIconResolvers[id]
            if (resolver == null) {
                Log.w(TAG, "[RNScreens] Unable to find icon resolver for menu element $id.")
                onResolved(null)
                return@StackHeaderToolbarMenuIconResolver
            }
            resolver.resolve(
                reactContext,
                iconSource.drawableIconResourceName,
                iconSource.imageIconUri,
            ) { result ->
                when (result) {
                    IconResolution.Unchanged -> onResolved(null) // keep the current icon
                    is IconResolution.Resolved -> {
                        // Keep the cache in sync with the prop-array path: both share this
                        // id's resolver.
                        toolbarMenuItemIcons = toolbarMenuItemIcons + (id to result.drawable)
                        onResolved(StackHeaderToolbarFieldUpdate.from(result.drawable))
                    }
                }
            }
        }

    // Serializes `updateToolbarMenuElements` batches and waits for every icon in a batch to
    // resolve before applying it, so each batch is applied atomically and in order.
    private val menuUpdateQueue =
        StackHeaderToolbarMenuUpdateQueue(
            iconResolver = commandIconResolver,
            delegate = { updates -> configObserver?.onMenuElementsUpdated(updates) },
        )

    /**
     * Enqueues a batch of toolbar menu element view commands. The batch is processed only
     * after any earlier batch has been fully applied, and is applied atomically once all of
     * its icons (if any) have resolved — see [StackHeaderToolbarMenuUpdateQueue].
     */
    internal fun dispatchMenuElementUpdates(updates: List<StackHeaderToolbarMenuElementRawUpdate>) {
        menuUpdateQueue.enqueue(updates)
    }

    // endregion

    // region UIManagerListener

    private var isInsideMountTransaction = false

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

    // region Teardown

    internal fun tearDown() {
        UIManagerHelper
            .getFabricUIManagerNotNull(reactContext)
            .removeUIManagerEventListener(this)
        menuUpdateQueue.clear()
        invalidationFlags = StackHeaderInvalidationFlags.NONE
        configObserver = null
    }

    // endregion

    companion object {
        private const val TAG = "StackHeaderConfig"
    }
}
