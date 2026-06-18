package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import com.google.android.material.bottomsheet.BottomSheetDialog

class FormSheetDialogManager(
    context: Context,
    private val host: FormSheetHost,
) {
    // Eagerly create the container so it's always ready for React's children
    private val container = FormSheetContainer(context) { width, height ->
        host.updateStateIfNeeded(width, height)
    }

    internal val contentView get() = container.contentView

    // Eagerly create the dialog and attach the container
    private val dialog = BottomSheetDialog(context).apply {
        setContentView(container)
        setOnDismissListener {
            host.onNativeDismiss()
        }
    }

    internal fun show() {
        dialog.show()
    }

    internal fun dismiss() {
        dialog.dismiss()
    }
}
