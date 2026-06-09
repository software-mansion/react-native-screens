package com.swmansion.rnscreens.gamma.stack.header.config

import android.view.View
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderConfigAndroidManagerDelegate
import com.facebook.react.viewmanagers.RNSStackHeaderConfigAndroidManagerInterface
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemConfig
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemDefaults
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemOptions
import com.swmansion.rnscreens.gamma.stack.header.toolbar.StackHeaderToolbarMenuItemShowAsAction

@ReactModule(name = StackHeaderConfigViewManager.REACT_CLASS)
open class StackHeaderConfigViewManager :
    ViewGroupManager<StackHeaderConfig>(),
    RNSStackHeaderConfigAndroidManagerInterface<StackHeaderConfig> {
    private val delegate: ViewManagerDelegate<StackHeaderConfig>

    init {
        delegate = RNSStackHeaderConfigAndroidManagerDelegate<StackHeaderConfig, StackHeaderConfigViewManager>(this)
    }

    override fun getName() = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = StackHeaderConfig(reactContext)

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: StackHeaderConfig,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    override fun getDelegate(): ViewManagerDelegate<StackHeaderConfig> = delegate

    /**
     * Subviews need to be positioned by native layout from Toolbar and CollapsingToolbarLayout.
     * Even with this option enabled, we receive dimensions calculated by Yoga via onMeasure.
     */
    override fun needsCustomLayoutForChildren() = true

    override fun addView(
        parent: StackHeaderConfig,
        child: View,
        index: Int,
    ) {
        require(child is StackHeaderSubview) {
            "[RNScreens] StackHeaderConfig can only have children of type StackHeaderSubview. Received $child instead."
        }
        parent.addConfigSubview(child)
    }

    override fun removeView(
        parent: StackHeaderConfig,
        view: View,
    ) {
        require(view is StackHeaderSubview) {
            "[RNScreens] StackHeaderConfig can only have children of type StackHeaderSubview. Attempted to remove $view instead."
        }
        parent.removeConfigSubview(view)
    }

    override fun removeViewAt(
        parent: StackHeaderConfig,
        index: Int,
    ) {
        parent.removeConfigSubviewAt(index)
    }

    override fun removeAllViews(parent: StackHeaderConfig) {
        parent.removeAllConfigSubviews()
    }

    override fun getChildCount(parent: StackHeaderConfig): Int = parent.configSubviewsCount

    override fun getChildAt(
        parent: StackHeaderConfig,
        index: Int,
    ): View? = parent.getConfigSubviewAt(index)

    override fun updateState(
        view: StackHeaderConfig,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.stateWrapper = stateWrapper
        return super.updateState(view, props, stateWrapper)
    }

    override fun onAfterUpdateTransaction(view: StackHeaderConfig) {
        super.onAfterUpdateTransaction(view)
        view.resolveBackButtonIconIfNeeded()
        view.notifyConfigChanged()
    }

    override fun setType(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.type =
            when (value) {
                "small" -> StackHeaderType.SMALL
                "medium" -> StackHeaderType.MEDIUM
                "large" -> StackHeaderType.LARGE
                else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid StackHeaderConfig type: $value.")
            }
    }

    override fun setTitle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.title = value ?: ""
    }

    override fun setHidden(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.hidden = value
    }

    override fun setTransparent(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.transparent = value
    }

    override fun setBackButtonHidden(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.backButtonHidden = value
    }

    override fun setBackButtonTintColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.backButtonTintColor = value
    }

    override fun setBackButtonDrawableIconResourceName(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.backButtonDrawableIconResourceName = value
    }

    override fun setBackButtonImageIconResource(
        view: StackHeaderConfig,
        value: ReadableMap?,
    ) {
        view.backButtonImageIconUri = value?.getString("uri")
    }

    override fun setScrollFlagScroll(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.scrollFlagScroll = value
    }

    override fun setScrollFlagEnterAlways(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.scrollFlagEnterAlways = value
    }

    override fun setScrollFlagEnterAlwaysCollapsed(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.scrollFlagEnterAlwaysCollapsed = value
    }

    override fun setScrollFlagExitUntilCollapsed(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.scrollFlagExitUntilCollapsed = value
    }

    override fun setScrollFlagSnap(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.scrollFlagSnap = value
    }

    override fun setToolbarMenuItems(
        view: StackHeaderConfig,
        value: ReadableArray?,
    ) {
        view.toolbarMenuItems =
            value?.let { array ->
                (0 until array.size()).map { i ->
                    val item = requireNotNull(array.getMap(i))
                    StackHeaderToolbarMenuItemConfig(
                        id = item.requireNotNullString("id"),
                        title = item.readString("title", StackHeaderToolbarMenuItemDefaults.TITLE),
                        hidden = item.readBoolean("hidden", StackHeaderToolbarMenuItemDefaults.HIDDEN),
                        showAsAction =
                            item.readShowAsActionEnum(
                                "showAsAction",
                                StackHeaderToolbarMenuItemDefaults.SHOW_AS_ACTION,
                            ),
                    )
                }
            } ?: emptyList()
    }

    override fun setToolbarMenuItemOptions(
        view: StackHeaderConfig,
        id: String,
        options: ReadableArray,
    ) {
        val map = options.getMap(0) ?: return
        view.dispatchMenuItemUpdate(
            id,
            StackHeaderToolbarMenuItemOptions(
                title = map.readNullableStringUpdate("title", StackHeaderToolbarMenuItemDefaults.TITLE),
                hidden = map.readNullableBooleanUpdate("hidden", StackHeaderToolbarMenuItemDefaults.HIDDEN),
                showAsAction =
                    map.readNullableShowAsActionEnumUpdate(
                        "showAsAction",
                        StackHeaderToolbarMenuItemDefaults.SHOW_AS_ACTION,
                    ),
            ),
        )
    }

    override fun setDO_NOT_USE(
        view: StackHeaderConfig,
        value: ReadableMap?,
    ) = Unit

    companion object {
        const val REACT_CLASS = "RNSStackHeaderConfigAndroid"
    }
}

private fun ReadableMap.requireNotNullString(key: String): String =
    requireNotNull(this.getString(key)) {
        "[RNScreens] toolbarMenuItem $key property must not be null."
    }

// Helpers for regular props (null/not defined -> default)
private fun ReadableMap.readString(
    key: String,
    default: String,
): String = if (!this.hasKey(key) || this.isNull(key)) default else this.getString(key) ?: default

private fun ReadableMap.readBoolean(
    key: String,
    default: Boolean,
): Boolean = if (!this.hasKey(key) || this.isNull(key)) default else this.getBoolean(key)

private fun ReadableMap.readShowAsActionEnum(
    key: String,
    default: StackHeaderToolbarMenuItemShowAsAction,
): StackHeaderToolbarMenuItemShowAsAction {
    val stringValue = this.getString(key) ?: return default
    return toMenuItemShowAsActionEnum(stringValue)
}

// Helpers for view commands:
// - not defined -> null (means "no update")
// - null -> default (means "reset to default value")
private fun ReadableMap.readNullableStringUpdate(
    key: String,
    default: String,
): String? =
    when {
        !this.hasKey(key) -> null
        this.isNull(key) -> default
        else -> this.getString(key) ?: default
    }

private fun ReadableMap.readNullableBooleanUpdate(
    key: String,
    default: Boolean,
): Boolean? =
    when {
        !this.hasKey(key) -> null
        this.isNull(key) -> default
        else -> this.getBoolean(key)
    }

private fun ReadableMap.readNullableShowAsActionEnumUpdate(
    key: String,
    default: StackHeaderToolbarMenuItemShowAsAction,
): StackHeaderToolbarMenuItemShowAsAction? =
    when {
        !this.hasKey(key) -> null
        this.isNull(key) -> default
        else ->
            this.getString(key)?.let {
                toMenuItemShowAsActionEnum(it)
            } ?: default
    }

private fun toMenuItemShowAsActionEnum(value: String): StackHeaderToolbarMenuItemShowAsAction =
    when (value) {
        "always" -> StackHeaderToolbarMenuItemShowAsAction.ALWAYS
        "alwaysWithText" -> StackHeaderToolbarMenuItemShowAsAction.ALWAYS_WITH_TEXT
        "ifRoom" -> StackHeaderToolbarMenuItemShowAsAction.IF_ROOM
        "ifRoomWithText" -> StackHeaderToolbarMenuItemShowAsAction.IF_ROOM_WITH_TEXT
        "never" -> StackHeaderToolbarMenuItemShowAsAction.NEVER
        else -> throw JSApplicationIllegalArgumentException("[RNScreens] Invalid value for StackHeaderToolbarMenuItemShowAsAction: $value.")
    }
