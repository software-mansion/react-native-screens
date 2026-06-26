package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import com.google.android.material.bottomsheet.BottomSheetDialog

internal class FormSheetDialog(
    context: Context,
) : BottomSheetDialog(context) {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        hideNativeDimmingView(window)
        disableNativeWindowAnimation(window)
    }

    private fun hideNativeDimmingView(window: Window?) = window?.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)

    private fun disableNativeWindowAnimation(window: Window?) = window?.setWindowAnimations(0)
}
