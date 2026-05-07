package com.swmansion.rnscreens

import android.view.View
import com.facebook.react.bridge.JSApplicationCausedNativeException
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackHeaderConfigManagerDelegate
import com.facebook.react.viewmanagers.RNSScreenStackHeaderConfigManagerInterface
import com.swmansion.rnscreens.events.HeaderAttachedEvent
import com.swmansion.rnscreens.events.HeaderDetachedEvent
import javax.annotation.Nonnull

@ReactModule(name = ScreenStackHeaderConfigViewManager.REACT_CLASS)
class ScreenStackHeaderConfigViewManager :
    ViewGroupManager<ScreenStackHeaderConfig>(),
    RNSScreenStackHeaderConfigManagerInterface<ScreenStackHeaderConfig> {
    private val delegate: ViewManagerDelegate<ScreenStackHeaderConfig>

    init {
        delegate = RNSScreenStackHeaderConfigManagerDelegate<ScreenStackHeaderConfig, ScreenStackHeaderConfigViewManager>(this)
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = ScreenStackHeaderConfig(reactContext)

    override fun addView(
        parent: ScreenStackHeaderConfig,
        child: View,
        index: Int,
    ) {
        if (child !is ScreenStackHeaderSubview) {
            throw JSApplicationCausedNativeException(
                "Config children should be of type " + ScreenStackHeaderSubviewManager.REACT_CLASS,
            )
        }
        parent.addConfigSubview(child, index)
    }

    override fun updateState(
        view: ScreenStackHeaderConfig,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.setStateWrapper(stateWrapper)
        return super.updateState(view, props, stateWrapper)
    }

    override fun onDropViewInstance(
        @Nonnull view: ScreenStackHeaderConfig,
    ) {
        view.destroy()
    }

    override fun removeAllViews(parent: ScreenStackHeaderConfig) {
        parent.removeAllConfigSubviews()
    }

    override fun removeViewAt(
        parent: ScreenStackHeaderConfig,
        index: Int,
    ) {
        parent.removeConfigSubview(index)
    }

    override fun getChildCount(parent: ScreenStackHeaderConfig): Int = parent.configSubviewsCount

    override fun getChildAt(
        parent: ScreenStackHeaderConfig,
        index: Int,
    ): View = parent.getConfigSubview(index)

    override fun needsCustomLayoutForChildren() = true

    override fun onAfterUpdateTransaction(parent: ScreenStackHeaderConfig) {
        super.onAfterUpdateTransaction(parent)
        parent.onUpdate()
    }

    override fun setConsumeTopInset(
        config: ScreenStackHeaderConfig,
        consumeTopInset: Boolean,
    ) {
        config.consumeTopInset = consumeTopInset
    }

    override fun setLegacyTopInsetBehavior(
        config: ScreenStackHeaderConfig,
        legacyTopInsetBehavior: Boolean,
    ) {
        config.legacyTopInsetBehavior = legacyTopInsetBehavior
    }

    override fun setTitle(
        config: ScreenStackHeaderConfig,
        title: String?,
    ) {
        config.setTitle(title)
    }

    override fun setTitleFontFamily(
        config: ScreenStackHeaderConfig,
        titleFontFamily: String?,
    ) {
        config.setTitleFontFamily(titleFontFamily)
    }

    override fun setTitleFontSize(
        config: ScreenStackHeaderConfig,
        titleFontSize: Int,
    ) {
        config.setTitleFontSize(titleFontSize.toFloat())
    }

    override fun setTitleFontWeight(
        config: ScreenStackHeaderConfig,
        titleFontWeight: String?,
    ) {
        config.setTitleFontWeight(titleFontWeight)
    }

    override fun setTitleColor(
        config: ScreenStackHeaderConfig,
        titleColor: Int?,
    ) {
        if (titleColor != null) {
            config.setTitleColor(titleColor)
        }
    }

    override fun setBackgroundColor(
        config: ScreenStackHeaderConfig,
        backgroundColor: Int?,
    ) {
        config.setBackgroundColor(backgroundColor)
    }

    override fun setHideShadow(
        config: ScreenStackHeaderConfig,
        hideShadow: Boolean,
    ) {
        config.setHideShadow(hideShadow)
    }

    override fun setHideBackButton(
        config: ScreenStackHeaderConfig,
        hideBackButton: Boolean,
    ) {
        config.setHideBackButton(hideBackButton)
    }

    override fun setColor(
        config: ScreenStackHeaderConfig,
        color: Int?,
    ) {
        config.setTintColor(color ?: 0)
    }

    override fun setHidden(
        config: ScreenStackHeaderConfig,
        hidden: Boolean,
    ) {
        config.setHidden(hidden)
    }

    override fun setTranslucent(
        config: ScreenStackHeaderConfig,
        translucent: Boolean,
    ) {
        config.setTranslucent(translucent)
    }

    override fun setBackButtonInCustomView(
        config: ScreenStackHeaderConfig,
        backButtonInCustomView: Boolean,
    ) {
        config.setBackButtonInCustomView(backButtonInCustomView)
    }

    override fun setDirection(
        config: ScreenStackHeaderConfig,
        direction: String?,
    ) {
        config.setDirection(direction)
    }

    // synchronousShadowStateUpdatesEnabled is not available on Android atm,
    // however we must override their setters
    override fun setSynchronousShadowStateUpdatesEnabled(
        config: ScreenStackHeaderConfig?,
        value: Boolean,
    ) = Unit

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
        hashMapOf(
            HeaderAttachedEvent.EVENT_NAME to hashMapOf("registrationName" to "onAttached"),
            HeaderDetachedEvent.EVENT_NAME to hashMapOf("registrationName" to "onDetached"),
        )

    protected override fun getDelegate(): ViewManagerDelegate<ScreenStackHeaderConfig> = delegate

    companion object {
        const val REACT_CLASS = "RNSScreenStackHeaderConfig"
    }

    // iOS only

    override fun setBackTitle(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit

    override fun setBackTitleFontFamily(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit

    override fun setBackTitleFontSize(
        view: ScreenStackHeaderConfig?,
        value: Int,
    ) = Unit

    override fun setBackTitleVisible(
        view: ScreenStackHeaderConfig?,
        value: Boolean,
    ) = Unit

    override fun setLargeTitle(
        view: ScreenStackHeaderConfig?,
        value: Boolean,
    ) = Unit

    override fun setLargeTitleFontFamily(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit

    override fun setLargeTitleFontSize(
        view: ScreenStackHeaderConfig?,
        value: Int,
    ) = Unit

    override fun setLargeTitleFontWeight(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit

    override fun setLargeTitleBackgroundColor(
        view: ScreenStackHeaderConfig?,
        value: Int?,
    ) = Unit

    override fun setLargeTitleHideShadow(
        view: ScreenStackHeaderConfig?,
        value: Boolean,
    ) = Unit

    override fun setLargeTitleColor(
        view: ScreenStackHeaderConfig?,
        value: Int?,
    ) = Unit

    override fun setDisableBackButtonMenu(
        view: ScreenStackHeaderConfig?,
        value: Boolean,
    ) = Unit

    override fun setBackButtonDisplayMode(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit

    override fun setBlurEffect(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit

    override fun setTopInsetEnabled(
        config: ScreenStackHeaderConfig,
        topInsetEnabled: Boolean,
    ) = Unit

    override fun setHeaderLeftBarButtonItems(
        view: ScreenStackHeaderConfig?,
        value: ReadableArray?,
    ) = Unit

    override fun setHeaderRightBarButtonItems(
        view: ScreenStackHeaderConfig?,
        value: ReadableArray?,
    ) = Unit

    override fun setUserInterfaceStyle(
        view: ScreenStackHeaderConfig?,
        value: String?,
    ) = Unit
}
