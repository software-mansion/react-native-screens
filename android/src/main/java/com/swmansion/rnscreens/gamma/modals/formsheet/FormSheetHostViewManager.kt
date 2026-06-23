package com.swmansion.rnscreens.gamma.modals.formsheet

import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ReactStylesDiffMap
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSFormSheetHostManagerDelegate
import com.facebook.react.viewmanagers.RNSFormSheetHostManagerInterface
import com.swmansion.rnscreens.gamma.helpers.makeEventRegistrationInfo

@ReactModule(name = FormSheetHostViewManager.REACT_CLASS)
class FormSheetHostViewManager :
    ViewGroupManager<FormSheetHost>(),
    RNSFormSheetHostManagerInterface<FormSheetHost> {
    private val delegate: ViewManagerDelegate<FormSheetHost> =
        RNSFormSheetHostManagerDelegate<FormSheetHost, FormSheetHostViewManager>(this)

    override fun getDelegate(): ViewManagerDelegate<FormSheetHost> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = FormSheetHost(reactContext)

    override fun addView(
        parent: FormSheetHost,
        child: View,
        index: Int,
    ) {
        parent.mountReactSubviewAt(child, index)
    }

    override fun removeView(
        parent: FormSheetHost,
        child: View,
    ) {
        parent.unmountReactSubview(child)
    }

    override fun removeViewAt(
        parent: FormSheetHost,
        index: Int,
    ) {
        parent.unmountReactSubviewAt(index)
    }

    override fun removeAllViews(parent: FormSheetHost) {
        parent.unmountAllReactSubviews()
    }

    override fun setIsOpen(
        view: FormSheetHost,
        value: Boolean,
    ) {
        view.setIsOpen(value)
    }

    override fun setDetents(
        view: FormSheetHost,
        value: ReadableArray?,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setPrefersGrabberVisible(
        view: FormSheetHost,
        value: Boolean,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setPreferredCornerRadius(
        view: FormSheetHost,
        value: Float,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setLargestUndimmedDetentIndex(
        view: FormSheetHost,
        value: Int,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setInitialDetentIndex(
        view: FormSheetHost,
        value: Int,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setPrefersScrollingExpandsWhenScrolledToEdge(
        view: FormSheetHost,
        value: Boolean,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setPreventNativeDismiss(
        view: FormSheetHost,
        value: Boolean,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun setNativeContainerBackgroundColor(
        view: FormSheetHost,
        value: Int?,
    ) {
        // TODO: @t0maboro - implement later
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        mutableMapOf(
            makeEventRegistrationInfo(FormSheetNativeDismissEvent),
            makeEventRegistrationInfo(FormSheetSyncFlushEvent),
        )

    override fun updateState(
        view: FormSheetHost,
        props: ReactStylesDiffMap?,
        stateWrapper: StateWrapper?,
    ): Any? {
        view.stateWrapper = stateWrapper
        return super.updateState(view, props, stateWrapper)
    }

    companion object {
        const val REACT_CLASS = "RNSFormSheetHost"
    }
}
