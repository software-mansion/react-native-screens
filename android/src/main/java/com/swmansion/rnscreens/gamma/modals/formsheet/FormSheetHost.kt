package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.view.View
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper

class FormSheetHost(context: Context) : ViewGroup(context) {

    private val dialogManager = FormSheetDialogManager(context, this)
    private var isOpen = false

    internal fun setIsOpen(open: Boolean) {
        if (this.isOpen == open) return
        this.isOpen = open

        if (isOpen) {
            dialogManager.show()
        } else {
            dialogManager.dismiss()
        }
    }

    // TODO: @t0maboro - dedicated FormSheetHostEventEmitter needs to be implemented later
    internal fun onNativeDismiss() {
        this.isOpen = false

        val reactContext = context as? ThemedReactContext ?: return
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)

        dispatcher?.dispatchEvent(
            FormSheetNativeDismissEvent(surfaceId, id)
        )
    }

    override fun addView(child: View?, index: Int) {
        dialogManager.container.addView(child, index)
    }

    override fun removeView(view: View?) {
        dialogManager.container.removeView(view)
    }

    override fun removeViewAt(index: Int) {
        dialogManager.container.removeViewAt(index)
    }

    override fun removeAllViews() {
        dialogManager.container.removeAllViews()
    }

    override fun getChildCount(): Int {
        return dialogManager.container.childCount
    }

    override fun getChildAt(index: Int): View? {
        return dialogManager.container.getChildAt(index)
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        // TODO: @t0maboro - implement before merging
    }
}
