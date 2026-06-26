package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.view.ContextThemeWrapper
import android.view.Window
import android.view.WindowManager
import android.widget.FrameLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.swmansion.rnscreens.gamma.modals.dimmingview.DimmingViewManager

class FormSheetDialogManager(
    context: Context,
    private val onUpdateState: (width: Int, height: Int) -> Unit,
    private val onDismissRequest: () -> Unit,
) {
    private val themedContext =
        ContextThemeWrapper(
            context,
            com.google.android.material.R.style.Theme_Material3_DayNight_NoActionBar,
        )

    // Eagerly create the container so it's always ready for React's children
    private val container =
        FormSheetContainer(context) { width, height ->
            onUpdateState(width, height)
        }

    internal val contentView get() = container.contentView

    // Eagerly create the dialog and attach the container
    private val dialog =
        BottomSheetDialog(themedContext).apply {
            setContentView(container)

            hideNativeDimmingView(window)
            disableNativeWindowAnimation(window)

            setOnCancelListener {
                onDismissRequest()
            }
        }

    private val bottomSheetView = dialog.findViewById<FrameLayout>(com.google.android.material.R.id.design_bottom_sheet)

    private val dimmingManager = DimmingViewManager(context, dialog)

    init {
        bottomSheetView?.let {
            // TODO: @t0maboro - BottomSheetBehavior override might be needed at some point
            val behavior = BottomSheetBehavior.from(it)
            dimmingManager.attachToBehavior(behavior)
        }

        dialog.setOnShowListener {
            dimmingManager.onShow()
        }

        dialog.setOnDismissListener {
            dimmingManager.onDismiss()
        }
    }

    internal fun show() {
        dialog.show()
    }

    internal fun dismiss() {
        dialog.dismiss()
    }

    private fun hideNativeDimmingView(window: Window?) = window?.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)

    private fun disableNativeWindowAnimation(window: Window?) = window?.setWindowAnimations(0)
}
