package com.swmansion.rnscreens.modals.formsheet

import android.content.Context
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.view.WindowManager
import android.widget.FrameLayout
import androidx.core.view.WindowCompat
import com.google.android.material.bottomsheet.BottomSheetDialog

/**
 * A custom BottomSheetDialog override used to render the FormSheet native component.
 *
 * We enforce edge-to-edge rendering, bypassing standard Material checks.
 * This enforcement is required because our custom dimming view must span the entire screen.
 * The FormSheetContainer is sized manually against the system insets.
 */
internal class FormSheetDialog(
    context: Context,
) : BottomSheetDialog(context) {
    internal fun interface CancelRequestInterceptor {
        /**
         * Invoked in place of the dialog's default cancellation whenever an interceptor is attached.
         *
         * The interceptor fully owns the outcome - either for native dismissal prevention or driving
         * a custom animated dismissal when is allowed. Either way the dialog skips
         * [BottomSheetDialog.cancel], which would tear the window down synchronously.
         */
        fun handleCancelRequest()
    }

    internal var cancelRequestInterceptor: CancelRequestInterceptor? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        hideNativeDimmingView(window)
        disableNativeWindowAnimation(window)

        setupBottomSheetHeight()
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()

        forceEdgeToEdge()
    }

    override fun cancel() {
        val interceptor = cancelRequestInterceptor
        if (interceptor == null) {
            super.cancel()
            return
        }

        interceptor.handleCancelRequest()
    }

    /**
     * Material's [BottomSheetDialog] only draws edge-to-edge when its theme opts in via the
     * `enableEdgeToEdge` attribute AND the navigation bar is translucent (see
     * `BottomSheetDialog#onAttachedToWindow`).
     *
     * We force edge-to-edge on every API level so the custom dimming view covers the whole screen.
     */
    private fun forceEdgeToEdge() {
        val window = window ?: return
        WindowCompat.setDecorFitsSystemWindows(window, false)
        findViewById<View>(com.google.android.material.R.id.container)?.fitsSystemWindows = false
        findViewById<View>(com.google.android.material.R.id.coordinator)?.fitsSystemWindows = false
    }

    private fun hideNativeDimmingView(window: Window?) = window?.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)

    private fun disableNativeWindowAnimation(window: Window?) = window?.setWindowAnimations(0)

    private fun setupBottomSheetHeight() {
        val bottomSheetView = findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)
        bottomSheetView?.layoutParams?.height = ViewGroup.LayoutParams.MATCH_PARENT
    }
}
