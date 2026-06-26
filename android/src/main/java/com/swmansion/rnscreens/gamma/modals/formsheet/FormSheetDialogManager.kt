package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import com.google.android.material.bottomsheet.BottomSheetDialog

class FormSheetDialogManager(
    context: Context,
    private val onUpdateState: (width: Int, height: Int) -> Unit,
    private val onDismissRequest: () -> Unit,
) {
    // Eagerly create the container so it's always ready for React's children
    private val container =
        FormSheetContainer(context) { width, height ->
            onUpdateState(width, height)
        }

    internal val contentView get() = container.contentView

    // Eagerly create the dialog and attach the container
    private val dialog =
        BottomSheetDialog(context).apply {
            setContentView(container)
            setOnCancelListener {
                onDismissRequest()
            }
        }

    internal fun show() {
        dialog.show()
    }

    internal fun dismiss() {
        dialog.dismiss()
    }
}
