package com.swmansion.rnscreens.gamma.modals.composebottomsheet

import android.view.View
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.ComposeBottomSheetManagerDelegate
import com.facebook.react.viewmanagers.ComposeBottomSheetManagerInterface

@ReactModule(name = ComposeBottomSheetManager.REACT_CLASS)
class ComposeBottomSheetManager :
    ViewGroupManager<ComposeBottomSheetView>(),
    ComposeBottomSheetManagerInterface<ComposeBottomSheetView> {

    private val delegate: ViewManagerDelegate<ComposeBottomSheetView> =
        ComposeBottomSheetManagerDelegate<ComposeBottomSheetView, ComposeBottomSheetManager>(this)

    override fun getName() = REACT_CLASS

    override fun getDelegate() = delegate

    override fun createViewInstance(reactContext: ThemedReactContext) =
        ComposeBottomSheetView(reactContext)

    override fun setIsOpen(view: ComposeBottomSheetView, value: Boolean) {
        view.setIsOpen(value)
    }

    override fun addView(
        parent: ComposeBottomSheetView,
        child: View,
        index: Int,
    ) {
        parent.addReactSubview(child, index)
    }

    override fun removeViewAt(
        parent: ComposeBottomSheetView,
        index: Int,
    ) {
        parent.removeReactSubviewAt(index)
    }

    override fun removeAllViews(parent: ComposeBottomSheetView) {
        parent.removeAllReactSubviews()
    }

    override fun getChildAt(
        parent: ComposeBottomSheetView,
        index: Int,
    ): View? = parent.getReactSubviewAt(index)

    override fun getChildCount(parent: ComposeBottomSheetView): Int = 
        parent.reactSubviewsCount

    companion object {
        const val REACT_CLASS = "ComposeBottomSheet"
    }
}
