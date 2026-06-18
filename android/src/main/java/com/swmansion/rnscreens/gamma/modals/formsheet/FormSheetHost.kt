package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper

class FormSheetHost(context: Context) : ViewGroup(context) {

    private val dialogManager = FormSheetDialogManager(context, this)
    private var isOpen = false

    fun setIsOpen(open: Boolean) {
        if (this.isOpen == open) return
        this.isOpen = open

        if (isOpen) {
            dialogManager.show()
        } else {
            dialogManager.dismiss()
        }
    }

    // TODO: @t0maboro - dedicated FormSheetHostEventEmitter needs to be implemented later
    fun onNativeDismiss() {
        this.isOpen = false

        val reactContext = context as? ThemedReactContext ?: return
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)

        dispatcher?.dispatchEvent(
            FormSheetNativeDismissEvent(surfaceId, id)
        )
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        // TODO: @t0maboro - implement before merging
    }
}
