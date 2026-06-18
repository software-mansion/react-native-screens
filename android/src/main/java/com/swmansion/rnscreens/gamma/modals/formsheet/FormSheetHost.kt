package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import android.view.View
import android.view.ViewGroup
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy

class FormSheetHost(
    context: Context,
) : ViewGroup(context) {
    private val dialogManager = FormSheetDialogManager(context, this)
    private var isOpen = false

    private val shadowStateProxy = ShadowStateProxy()

    internal var stateWrapper by shadowStateProxy::stateWrapper

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
            FormSheetNativeDismissEvent(surfaceId, id),
        )
    }

    internal fun mountReactSubviewAt(
        child: View,
        index: Int,
    ) {
        dialogManager.contentView.addView(child, index)
    }

    internal fun unmountReactSubview(child: View) {
        dialogManager.contentView.removeView(child)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        dialogManager.contentView.removeViewAt(index)
    }

    internal fun unmountAllReactSubviews() {
        dialogManager.contentView.removeAllViews()
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        // TODO: @t0maboro - implement before merging
    }

    internal fun updateStateIfNeeded(
        width: Int,
        height: Int,
    ) = shadowStateProxy.updateStateIfNeeded(
        density = resources.displayMetrics.density,
        frameWidth = width,
        frameHeight = height,
    )
}
