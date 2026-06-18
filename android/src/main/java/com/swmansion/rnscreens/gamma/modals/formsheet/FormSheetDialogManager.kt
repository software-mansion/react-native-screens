package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import com.google.android.material.bottomsheet.BottomSheetDialog

class FormSheetDialogManager(
    private val context: Context,
    private val host: FormSheetHost,
) {
    private var dialog: BottomSheetDialog? = null

    fun show() {
        if (dialog == null) {
            dialog =
                BottomSheetDialog(context).apply {
                    setOnDismissListener {
                        host.onNativeDismiss()
                    }
                }
        }
        dialog?.show()
    }

    fun dismiss() {
        dialog?.dismiss()
    }
}
