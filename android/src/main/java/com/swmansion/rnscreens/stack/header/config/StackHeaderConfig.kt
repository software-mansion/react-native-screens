package com.swmansion.rnscreens.stack.header.config

import android.annotation.SuppressLint
import android.graphics.drawable.Drawable
import android.util.LayoutDirection
import android.view.Gravity
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.common.ShadowStateProxy
import com.swmansion.rnscreens.common.text.ReactTextAppearance
import com.swmansion.rnscreens.helpers.IconResolution
import com.swmansion.rnscreens.helpers.PropIconResolver
import com.swmansion.rnscreens.helpers.getFabricUIManagerNotNull
import com.swmansion.rnscreens.helpers.resolveImage
import com.swmansion.rnscreens.stack.header.subview.OnStackHeaderSubviewChangeListener
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubviewType
import com.swmansion.rnscreens.stack.header.toolbar.StackHeaderToolbarMenuController
import com.swmansion.rnscreens.stack.header.toolbar.StackHeaderToolbarMenuDelegate
import com.swmansion.rnscreens.stack.header.toolbar.model.StackHeaderToolbarMenuConfig
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementRawUpdate
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuIconResolver
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor")
internal class StackHeaderConfig(
    val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderConfigurationProviding,
    StackHeaderDelegate,
    StackHeaderToolbarMenuDelegate,
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

    override var type: StackHeaderType by invalidatingProperty(StackHeaderType.SMALL, StackHeaderInvalidationFlags.STRUCTURE)
        internal set

    override var title: String by invalidatingProperty("", StackHeaderInvalidationFlags.TITLE)
        internal set

    override var subtitle: String by invalidatingProperty("", StackHeaderInvalidationFlags.TITLE)
        internal set

    // Requires header rebuild due to bug in Material implementation
    override var maxLines: Int by invalidatingProperty(1, StackHeaderInvalidationFlags.STRUCTURE)
        internal set

    override var hidden: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.STRUCTURE)
        internal set

    override var transparent: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.STRUCTURE)
        internal set

    override var backButtonHidden: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.BACK_BUTTON)
        internal set

    override var backButtonTintColorNormal: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACK_BUTTON)
        internal set

    override var backButtonTintColorPressed: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACK_BUTTON)
        internal set

    override var backButtonTintColorFocused: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACK_BUTTON)
        internal set

    override var backButtonIcon: Drawable? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACK_BUTTON)
        internal set

    override var overflowIconTintColorNormal: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.OVERFLOW_ICON)
        internal set

    override var overflowIconTintColorPressed: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.OVERFLOW_ICON)
        internal set

    override var overflowIconTintColorFocused: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.OVERFLOW_ICON)
        internal set

    override var overflowIcon: Drawable? by invalidatingProperty(null, StackHeaderInvalidationFlags.OVERFLOW_ICON)
        internal set

    override var scrollFlagScroll: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.SCROLL_FLAGS)
        internal set

    override var scrollFlagEnterAlways: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.SCROLL_FLAGS)
        internal set

    override var scrollFlagEnterAlwaysCollapsed: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.SCROLL_FLAGS)
        internal set

    override var scrollFlagExitUntilCollapsed: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.SCROLL_FLAGS)
        internal set

    override var scrollFlagSnap: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.SCROLL_FLAGS)
        internal set

    override var liftOnScroll: Boolean by invalidatingProperty(true, StackHeaderInvalidationFlags.LIFT_ON_SCROLL)
        internal set

    override var backgroundColor: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACKGROUND_COLORS)
        internal set

    override var scrolledBackgroundColor: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACKGROUND_COLORS)
        internal set

    override var statusBarScrimColor: Int? by invalidatingProperty(null, StackHeaderInvalidationFlags.BACKGROUND_COLORS)
        internal set

    override var titleCentered: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.TITLE_POSITIONING)
        internal set

    override var subtitleCentered: Boolean by invalidatingProperty(false, StackHeaderInvalidationFlags.TITLE_POSITIONING)
        internal set

    override var expandedTitleHorizontalGravity: Int by invalidatingProperty(Gravity.START, StackHeaderInvalidationFlags.TITLE_POSITIONING)
        internal set

    override var expandedTitleVerticalGravity: Int by invalidatingProperty(Gravity.BOTTOM, StackHeaderInvalidationFlags.TITLE_POSITIONING)
        internal set

    override var collapsedTitleHorizontalGravity: Int by invalidatingProperty(Gravity.START, StackHeaderInvalidationFlags.TITLE_POSITIONING)
        internal set

    override var collapsedTitleVerticalGravity: Int by invalidatingProperty(
        Gravity.CENTER_VERTICAL,
        StackHeaderInvalidationFlags.TITLE_POSITIONING,
    )
        internal set

    override var collapsedTitleGravityMode: StackHeaderCollapsedTitleGravityMode
        by invalidatingProperty(StackHeaderCollapsedTitleGravityMode.AVAILABLE_SPACE, StackHeaderInvalidationFlags.STRUCTURE)
        internal set

    override var contentInsetStart: Float?
        by invalidatingProperty(null, StackHeaderInvalidationFlags.CONTENT_INSETS)
        internal set

    override var contentInsetEnd: Float?
        by invalidatingProperty(null, StackHeaderInvalidationFlags.CONTENT_INSETS)
        internal set

    override val titleAppearance = ReactTextAppearance(reactContext.assets, ::invalidateTextAppearance)
    override val subtitleAppearance = ReactTextAppearance(reactContext.assets, ::invalidateTextAppearance)
    override val expandedTitleAppearance = ReactTextAppearance(reactContext.assets, ::invalidateTextAppearance)
    override val collapsedTitleAppearance = ReactTextAppearance(reactContext.assets, ::invalidateTextAppearance)
    override val expandedSubtitleAppearance = ReactTextAppearance(reactContext.assets, ::invalidateTextAppearance)
    override val collapsedSubtitleAppearance = ReactTextAppearance(reactContext.assets, ::invalidateTextAppearance)

    private fun invalidateTextAppearance() = invalidate(StackHeaderInvalidationFlags.TITLE_APPEARANCE)

    override val isRTL: Boolean
        get() = layoutDirection == LayoutDirection.RTL

    // endregion

    // region Content scroll view

    /**
     * Called by the owning [com.swmansion.rnscreens.stack.screen.StackScreen]
     * when its content scroll view changes (e.g. a `ScrollViewMarker` registered
     * one). Re-triggers lift-on-scroll so the coordinator can resolve and apply
     * the up-to-date `liftOnScrollTargetView`.
     */
    internal fun onContentScrollViewChanged() {
        invalidate(StackHeaderInvalidationFlags.LIFT_ON_SCROLL)
        if (!isInsideMountTransaction) {
            flushUpdates()
        }
    }

    // endregion

    // region Back button icon resolution

    // Staging fields for back button icon resolution.
    // Both props may arrive in any order within a single update batch.
    // Resolution happens in resolveBackButtonIconIfNeeded(), called from onAfterUpdateTransaction.
    internal var backButtonDrawableIconResourceName: String? = null
    internal var backButtonImageIconUri: String? = null
    private val backButtonIconResolver = createPropIconResolver(reactContext)

    internal fun resolveBackButtonIconIfNeeded() {
        backButtonIconResolver.resolve(
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

    // region Overflow menu icon resolution

    // Staging fields for overflow menu icon resolution — mirrors the back button icon.
    // Resolution happens in resolveOverflowIconIfNeeded(), called from onAfterUpdateTransaction.
    internal var overflowIconDrawableIconResourceName: String? = null
    internal var overflowIconImageIconUri: String? = null
    private val overflowIconResolver = createPropIconResolver(reactContext)

    internal fun resolveOverflowIconIfNeeded() {
        overflowIconResolver.resolve(
            overflowIconDrawableIconResourceName,
            overflowIconImageIconUri,
        ) { result ->
            when (result) {
                IconResolution.Unchanged -> Unit
                is IconResolution.Resolved -> {
                    overflowIcon = result.drawable
                    if (!isInsideMountTransaction) {
                        flushUpdates()
                    }
                }
            }
        }
    }

    // endregion

    // region Toolbar menu

    override val toolbarMenuController =
        StackHeaderToolbarMenuController(createMenuIconResolver(reactContext))
            .also { it.delegate = WeakReference(this) }

    internal fun setToolbarMenuFromProps(menu: StackHeaderToolbarMenuConfig) {
        if (toolbarMenuController.setMenu(menu)) {
            invalidate(StackHeaderInvalidationFlags.TOOLBAR_MENU)
        }
    }

    internal fun setToolbarMenuGroupDividerEnabledFromProps(enabled: Boolean) {
        if (toolbarMenuController.setGroupDividerEnabled(enabled)) {
            invalidate(StackHeaderInvalidationFlags.TOOLBAR_MENU)
        }
    }

    internal fun dispatchMenuElementUpdates(updates: List<StackHeaderToolbarMenuElementRawUpdate>) {
        toolbarMenuController.enqueueElementUpdates(updates)
    }

    // StackHeaderToolbarMenuDelegate -> JS events

    override fun onMenuItemClicked(id: String) {
        eventEmitter.emitOnToolbarMenuItemPress(id)
    }

    override fun onGroupSelectionChanged(
        groupId: String,
        selectedIds: List<String>,
    ) {
        eventEmitter.emitOnToolbarMenuGroupSelectionChange(groupId, selectedIds)
    }

    // endregion

    // region Subviews

    override var backgroundSubview: StackHeaderSubview? by invalidatingProperty(null, StackHeaderInvalidationFlags.SUBVIEWS)
        private set

    override var leadingSubview: StackHeaderSubview? by invalidatingProperty(null, StackHeaderInvalidationFlags.SUBVIEWS)
        private set

    override var centerSubview: StackHeaderSubview? by invalidatingProperty(null, StackHeaderInvalidationFlags.SUBVIEWS)
        private set

    override var trailingSubview: StackHeaderSubview? by invalidatingProperty(null, StackHeaderInvalidationFlags.SUBVIEWS)
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
        toolbarMenuController.tearDown()
        invalidationFlags = StackHeaderInvalidationFlags.NONE
        configObserver = null
    }

    // endregion

    // region Helpers

    private fun <T> invalidatingProperty(
        initialValue: T,
        flag: StackHeaderInvalidationFlags,
    ) = Delegates.observable(initialValue) { _, old, new ->
        if (old != new) invalidate(flag)
    }

    // endregion

    // Built outside the instance scope on purpose: a lambda capturing this view
    // would be retained by every icon load still in flight.
    private companion object {
        fun createPropIconResolver(context: ThemedReactContext) =
            PropIconResolver { name, uri, onComplete ->
                resolveImage(context, name, uri, onComplete)
            }

        fun createMenuIconResolver(context: ThemedReactContext) =
            StackHeaderToolbarMenuIconResolver { iconSource, onResolved ->
                resolveImage(
                    context,
                    iconSource.drawableIconResourceName,
                    iconSource.imageIconUri,
                    onResolved,
                )
            }
    }
}
