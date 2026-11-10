package com.swmansion.rnscreens.react.modals.sheet.host

import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSSheetHostManagerDelegate
import com.facebook.react.viewmanagers.RNSSheetHostManagerInterface
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDetentChangedEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDidAppearEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDidDisappearEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetDismissEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetNativeDismissEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetNativeDismissPreventedEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetSyncFlushEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetWillAppearEvent
import com.swmansion.rnscreens.react.modals.sheet.event.SheetWillDisappearEvent
import com.swmansion.rnscreens.react.utils.makeEventRegistrationInfo

@ReactModule(name = SheetHostViewManager.REACT_CLASS)
class SheetHostViewManager :
    ViewGroupManager<SheetHost>(),
    RNSSheetHostManagerInterface<SheetHost> {
    private val delegate: ViewManagerDelegate<SheetHost> =
        RNSSheetHostManagerDelegate<SheetHost, SheetHostViewManager>(this)

    override fun getDelegate(): ViewManagerDelegate<SheetHost> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = SheetHost(reactContext)

    override fun addView(
        parent: SheetHost,
        child: View,
        index: Int,
    ) {
        parent.mountReactSubviewAt(child, index)
    }

    override fun removeView(
        parent: SheetHost,
        child: View,
    ) {
        parent.unmountReactSubview(child)
    }

    override fun removeViewAt(
        parent: SheetHost,
        index: Int,
    ) {
        parent.unmountReactSubviewAt(index)
    }

    override fun removeAllViews(parent: SheetHost) {
        parent.unmountAllReactSubviews()
    }

    override fun getChildCount(parent: SheetHost): Int = parent.getReactSubviewCount()

    override fun getChildAt(
        parent: SheetHost,
        index: Int,
    ): View? = parent.getReactSubviewAt(index)

    override fun setPresentationStyle(
        view: SheetHost,
        value: String?,
    ) {
        // Both `formSheet` and `pageSheet` present the same bottom sheet dialog on Android.
    }

    override fun setIsOpen(
        view: SheetHost,
        value: Boolean,
    ) {
        view.isOpen = value
    }

    override fun setDetents(
        view: SheetHost,
        value: ReadableArray?,
    ) {
        view.detents =
            value?.let { array ->
                List(array.size()) { index -> array.getDouble(index) }
            } ?: emptyList()
    }

    override fun setPrefersGrabberVisible(
        view: SheetHost,
        value: Boolean,
    ) {
        view.prefersGrabberVisible = value
    }

    override fun setPreferredCornerRadius(
        view: SheetHost,
        value: Float,
    ) {
        view.preferredCornerRadius = value
    }

    override fun setLargestUndimmedDetentIndex(
        view: SheetHost,
        value: Int,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setInitialDetentIndex(
        view: SheetHost,
        value: Int,
    ) {
        view.initialDetentIndex = value
    }

    override fun setPrefersScrollingExpandsWhenScrolledToEdge(
        view: SheetHost,
        value: Boolean,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setPrefersEdgeAttachedInCompactHeight(
        view: SheetHost,
        value: Boolean,
    ) {
        // iOS only
    }

    override fun setPreferredContentWidth(
        view: SheetHost,
        value: Float,
    ) {
        // iOS only
    }

    override fun setPreferredContentHeight(
        view: SheetHost,
        value: Float,
    ) {
        // iOS only
    }

    override fun setWidthFollowsPreferredContentSizeWhenEdgeAttached(
        view: SheetHost,
        value: Boolean,
    ) {
        // iOS only
    }

    override fun setPreventNativeDismiss(
        view: SheetHost,
        value: Boolean,
    ) {
        view.preventNativeDismiss = value
    }

    override fun setNativeContainerBackgroundColor(
        view: SheetHost,
        value: Int?,
    ) {
        view.nativeContainerBackgroundColor = value
    }

    override fun setBackgroundEffect(
        view: SheetHost,
        value: String?,
    ) {
        // iOS only
    }

    override fun setBackgroundEffectColor(
        view: SheetHost,
        value: Int?,
    ) {
        // iOS only
    }

    override fun setBackgroundEffectBlurStyle(
        view: SheetHost,
        value: String?,
    ) {
        // iOS only
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(SheetDismissEvent),
            makeEventRegistrationInfo(SheetNativeDismissEvent),
            makeEventRegistrationInfo(SheetSyncFlushEvent),
            makeEventRegistrationInfo(SheetWillAppearEvent),
            makeEventRegistrationInfo(SheetDidAppearEvent),
            makeEventRegistrationInfo(SheetWillDisappearEvent),
            makeEventRegistrationInfo(SheetDidDisappearEvent),
            makeEventRegistrationInfo(SheetDetentChangedEvent),
            makeEventRegistrationInfo(SheetNativeDismissPreventedEvent),
        )

    override fun updateState(
        view: SheetHost,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.stateWrapper = stateWrapper
        return super.updateState(view, props, stateWrapper)
    }

    override fun onAfterUpdateTransaction(view: SheetHost) {
        super.onAfterUpdateTransaction(view)
        view.onAfterUpdateTransaction()
    }

    override fun addEventEmitters(
        reactContext: ThemedReactContext,
        view: SheetHost,
    ) {
        super.addEventEmitters(reactContext, view)
        view.onViewManagerAddEventEmitters()
    }

    override fun onDropViewInstance(view: SheetHost) {
        view.destroy()
        super.onDropViewInstance(view)
    }

    companion object {
        const val REACT_CLASS = "RNSSheetHost"
    }
}
