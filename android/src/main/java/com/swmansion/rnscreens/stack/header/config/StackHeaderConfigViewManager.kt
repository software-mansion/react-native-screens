package com.swmansion.rnscreens.stack.header.config

import android.util.Log
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

    companion object {
        private const val TAG = "StackHeaderConfigViewManager"
        const val REACT_CLASS = "RNSStackHeaderConfigAndroid"
    }
}
