package com.swmansion.rnscreens.gamma.modals.formsheet

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSFormSheetContentWrapperManagerDelegate
import com.facebook.react.viewmanagers.RNSFormSheetContentWrapperManagerInterface

@ReactModule(name = FormSheetContentWrapperViewManager.REACT_CLASS)
class FormSheetContentWrapperViewManager :
    ViewGroupManager<FormSheetContentWrapper>(),
    RNSFormSheetContentWrapperManagerInterface<FormSheetContentWrapper> {
    private val delegate: ViewManagerDelegate<FormSheetContentWrapper> =
        RNSFormSheetContentWrapperManagerDelegate<FormSheetContentWrapper, FormSheetContentWrapperViewManager>(this)

    override fun getDelegate(): ViewManagerDelegate<FormSheetContentWrapper> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = FormSheetContentWrapper(reactContext)

    companion object {
        const val REACT_CLASS = "RNSFormSheetContentWrapper"
    }
}
