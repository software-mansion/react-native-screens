package com.swmansion.rnscreens.react.modals.sheet.contentwrapper

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNSSheetContentWrapperManagerDelegate
import com.facebook.react.viewmanagers.RNSSheetContentWrapperManagerInterface

@ReactModule(name = SheetContentWrapperViewManager.REACT_CLASS)
class SheetContentWrapperViewManager :
    ViewGroupManager<SheetContentWrapper>(),
    RNSSheetContentWrapperManagerInterface<SheetContentWrapper> {
    private val delegate: ViewManagerDelegate<SheetContentWrapper> =
        RNSSheetContentWrapperManagerDelegate<SheetContentWrapper, SheetContentWrapperViewManager>(this)

    override fun getDelegate(): ViewManagerDelegate<SheetContentWrapper> = delegate

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext) = SheetContentWrapper(reactContext)

    companion object {
        const val REACT_CLASS = "RNSSheetContentWrapper"
    }
}
