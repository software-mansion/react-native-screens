package com.swmansion.rnscreens.gamma.modals.formsheet

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.viewmanagers.RNSFormSheetHostManagerInterface
import com.facebook.react.viewmanagers.RNSFormSheetHostManagerDelegate
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.bridge.ReadableArray

@ReactModule(name = FormSheetHostViewManager.REACT_CLASS)
class FormSheetHostViewManager : ViewGroupManager<FormSheetHost>(), RNSFormSheetHostManagerInterface<FormSheetHost> {

    private val delegate: ViewManagerDelegate<FormSheetHost> = RNSFormSheetHostManagerDelegate<FormSheetHost, FormSheetHostViewManager>(this)

    override fun getDelegate(): ViewManagerDelegate<FormSheetHost> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = FormSheetHost(reactContext)

    override fun setIsOpen(view: FormSheetHost, value: Boolean) {
        // TODO: @t0maboro - implement before merging
    }

    override fun setDetents(view: FormSheetHost, value: ReadableArray?) {
        // TODO: @t0maboro - implement later
    }

    override fun setPrefersGrabberVisible(view: FormSheetHost, value: Boolean) {
        // TODO: @t0maboro - implement later
    }

    override fun setPreferredCornerRadius(view: FormSheetHost, value: Float) {
        // TODO: @t0maboro - implement later
    }

    override fun setLargestUndimmedDetentIndex(view: FormSheetHost, value: Int) {
        // TODO: @t0maboro - implement later
    }

    override fun setInitialDetentIndex(view: FormSheetHost, value: Int) {
        // TODO: @t0maboro - implement later
    }

    override fun setPrefersScrollingExpandsWhenScrolledToEdge(view: FormSheetHost, value: Boolean) {
        // TODO: @t0maboro - implement later
    }

    override fun setPreventNativeDismiss(view: FormSheetHost, value: Boolean) {
        // TODO: @t0maboro - implement later
    }

    override fun setNativeContainerBackgroundColor(view: FormSheetHost, value: Int?) {
        // TODO: @t0maboro - implement later
    }

    companion object {
        const val REACT_CLASS = "RNSFormSheetHost"
    }
}
