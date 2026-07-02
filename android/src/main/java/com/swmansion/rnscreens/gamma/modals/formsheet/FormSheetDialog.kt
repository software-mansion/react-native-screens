package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.os.Bundle
import android.view.ViewGroup
import android.view.Window
import android.view.WindowManager
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetDialog

internal class FormSheetDialog(
    context: Context,
) : BottomSheetDialog(context) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        hideNativeDimmingView(window)
        disableNativeWindowAnimation(window)

        setupBottomSheetHeight()
    }

    private fun hideNativeDimmingView(window: Window?) = window?.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)

    private fun disableNativeWindowAnimation(window: Window?) = window?.setWindowAnimations(0)

    private fun setupBottomSheetHeight() {
        val bottomSheetView = findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)
        bottomSheetView?.layoutParams?.height = ViewGroup.LayoutParams.MATCH_PARENT
    }
}
