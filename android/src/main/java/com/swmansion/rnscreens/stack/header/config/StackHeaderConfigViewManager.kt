package com.swmansion.rnscreens.stack.header.config

import android.util.Log
import android.view.Gravity
import android.view.View
import com.facebook.react.bridge.Dynamic
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
import com.swmansion.rnscreens.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.stack.header.toolbar.StackHeaderToolbarMenuMapper
import com.swmansion.rnscreens.stack.header.toolbar.update.StackHeaderToolbarMenuElementRawUpdate

@ReactModule(name = StackHeaderConfigViewManager.REACT_CLASS)
internal open class StackHeaderConfigViewManager :
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
        view.resolveOverflowIconIfNeeded()
        view.resolveToolbarMenuItemIconsIfNeeded()
    }

    override fun onDropViewInstance(view: StackHeaderConfig) {
        view.tearDown()
        super.onDropViewInstance(view)
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

    override fun setSubtitle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.subtitle = value ?: ""
    }

    override fun setTitleCentered(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.titleCentered = value
    }

    override fun setSubtitleCentered(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.subtitleCentered = value
    }

    override fun setExpandedTitleHorizontalGravity(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedTitleHorizontalGravity = parseHorizontalGravity(value)
    }

    override fun setExpandedTitleVerticalGravity(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedTitleVerticalGravity = parseVerticalGravity(value)
    }

    override fun setCollapsedTitleHorizontalGravity(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedTitleHorizontalGravity = parseHorizontalGravity(value)
    }

    override fun setCollapsedTitleVerticalGravity(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedTitleVerticalGravity = parseVerticalGravity(value)
    }

    override fun setCollapsedTitleGravityMode(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedTitleGravityMode =
            when (value) {
                "entireSpace" -> StackHeaderCollapsedTitleGravityMode.ENTIRE_SPACE
                "availableSpace" -> StackHeaderCollapsedTitleGravityMode.AVAILABLE_SPACE
                else -> throw JSApplicationIllegalArgumentException(
                    "[RNScreens] Invalid StackHeaderConfig collapsedTitleGravityMode: $value.",
                )
            }
    }

    // region Text appearance
    // Font size arrives as a float defaulting to -1 (unset); non-positive means "use default".

    override fun setTitleColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.titleAppearance.color = value
    }

    override fun setTitleFontFamily(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.titleAppearance.fontFamily = value
    }

    override fun setTitleFontSize(
        view: StackHeaderConfig,
        value: Float,
    ) {
        view.titleAppearance.fontSize = value.takeIf { it > 0f }
    }

    override fun setTitleFontWeight(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.titleAppearance.fontWeight = value
    }

    override fun setTitleFontStyle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.titleAppearance.fontStyle = value
    }

    override fun setSubtitleColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.subtitleAppearance.color = value
    }

    override fun setSubtitleFontFamily(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.subtitleAppearance.fontFamily = value
    }

    override fun setSubtitleFontSize(
        view: StackHeaderConfig,
        value: Float,
    ) {
        view.subtitleAppearance.fontSize = value.takeIf { it > 0f }
    }

    override fun setSubtitleFontWeight(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.subtitleAppearance.fontWeight = value
    }

    override fun setSubtitleFontStyle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.subtitleAppearance.fontStyle = value
    }

    override fun setExpandedTitleColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.expandedTitleAppearance.color = value
    }

    override fun setExpandedTitleFontFamily(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedTitleAppearance.fontFamily = value
    }

    override fun setExpandedTitleFontSize(
        view: StackHeaderConfig,
        value: Float,
    ) {
        view.expandedTitleAppearance.fontSize = value.takeIf { it > 0f }
    }

    override fun setExpandedTitleFontWeight(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedTitleAppearance.fontWeight = value
    }

    override fun setExpandedTitleFontStyle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedTitleAppearance.fontStyle = value
    }

    override fun setCollapsedTitleColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.collapsedTitleAppearance.color = value
    }

    override fun setCollapsedTitleFontFamily(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedTitleAppearance.fontFamily = value
    }

    override fun setCollapsedTitleFontSize(
        view: StackHeaderConfig,
        value: Float,
    ) {
        view.collapsedTitleAppearance.fontSize = value.takeIf { it > 0f }
    }

    override fun setCollapsedTitleFontWeight(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedTitleAppearance.fontWeight = value
    }

    override fun setCollapsedTitleFontStyle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedTitleAppearance.fontStyle = value
    }

    override fun setExpandedSubtitleColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.expandedSubtitleAppearance.color = value
    }

    override fun setExpandedSubtitleFontFamily(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedSubtitleAppearance.fontFamily = value
    }

    override fun setExpandedSubtitleFontSize(
        view: StackHeaderConfig,
        value: Float,
    ) {
        view.expandedSubtitleAppearance.fontSize = value.takeIf { it > 0f }
    }

    override fun setExpandedSubtitleFontWeight(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedSubtitleAppearance.fontWeight = value
    }

    override fun setExpandedSubtitleFontStyle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.expandedSubtitleAppearance.fontStyle = value
    }

    override fun setCollapsedSubtitleColor(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.collapsedSubtitleAppearance.color = value
    }

    override fun setCollapsedSubtitleFontFamily(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedSubtitleAppearance.fontFamily = value
    }

    override fun setCollapsedSubtitleFontSize(
        view: StackHeaderConfig,
        value: Float,
    ) {
        view.collapsedSubtitleAppearance.fontSize = value.takeIf { it > 0f }
    }

    override fun setCollapsedSubtitleFontWeight(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedSubtitleAppearance.fontWeight = value
    }

    override fun setCollapsedSubtitleFontStyle(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.collapsedSubtitleAppearance.fontStyle = value
    }

    // endregion

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

    override fun setBackButtonTintColorNormal(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.backButtonTintColorNormal = value
    }

    override fun setBackButtonTintColorPressed(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.backButtonTintColorPressed = value
    }

    override fun setBackButtonTintColorFocused(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.backButtonTintColorFocused = value
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

    override fun setOverflowIconTintColorNormal(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.overflowIconTintColorNormal = value
    }

    override fun setOverflowIconTintColorPressed(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.overflowIconTintColorPressed = value
    }

    override fun setOverflowIconTintColorFocused(
        view: StackHeaderConfig,
        value: Int?,
    ) {
        view.overflowIconTintColorFocused = value
    }

    override fun setOverflowIconDrawableIconResourceName(
        view: StackHeaderConfig,
        value: String?,
    ) {
        view.overflowIconDrawableIconResourceName = value
    }

    override fun setOverflowIconImageIconResource(
        view: StackHeaderConfig,
        value: ReadableMap?,
    ) {
        view.overflowIconImageIconUri = value?.getString("uri")
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

    override fun setLiftOnScroll(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.liftOnScroll = value
    }

    override fun setToolbarMenuGroupDividerEnabled(
        view: StackHeaderConfig,
        value: Boolean,
    ) {
        view.toolbarMenuGroupDividerEnabled = value
    }

    override fun setToolbarMenu(
        view: StackHeaderConfig,
        value: Dynamic,
    ) {
        val (menu, iconSources) = StackHeaderToolbarMenuMapper.parseMenu(view.context, value)
        view.toolbarMenu = menu
        view.toolbarMenuItemIconSourceMap = iconSources
    }

    override fun updateToolbarMenuElements(
        view: StackHeaderConfig,
        updates: ReadableArray,
    ) {
        val parsed = ArrayList<StackHeaderToolbarMenuElementRawUpdate>(updates.size())
        for (i in 0 until updates.size()) {
            val map = updates.getMap(i)
            if (map == null) {
                Log.w(TAG, "[RNScreens] Skipping toolbar menu update at index $i: not an object.")
                continue
            }
            val id = map.getString("id")
            if (id == null) {
                Log.w(TAG, "[RNScreens] Skipping toolbar menu update at index $i: missing 'id'.")
                continue
            }
            parsed.add(
                StackHeaderToolbarMenuElementRawUpdate(
                    id,
                    StackHeaderToolbarMenuMapper.parseMenuElementOptions(view.context, map),
                    StackHeaderToolbarMenuMapper.parseMenuElementIconSource(map),
                ),
            )
        }
        view.dispatchMenuElementUpdates(parsed)
    }

    private fun parseHorizontalGravity(value: String?): Int =
        when (value) {
            "start" -> Gravity.START
            "center" -> Gravity.CENTER_HORIZONTAL
            "end" -> Gravity.END
            else -> throw JSApplicationIllegalArgumentException(
                "[RNScreens] Invalid StackHeaderConfig title horizontal gravity: $value.",
            )
        }

    private fun parseVerticalGravity(value: String?): Int =
        when (value) {
            "top" -> Gravity.TOP
            "center" -> Gravity.CENTER_VERTICAL
            "bottom" -> Gravity.BOTTOM
            else -> throw JSApplicationIllegalArgumentException(
                "[RNScreens] Invalid StackHeaderConfig title vertical gravity: $value.",
            )
        }

    companion object {
        private const val TAG = "StackHeaderConfigViewManager"
        const val REACT_CLASS = "RNSStackHeaderConfigAndroid"
    }
}
