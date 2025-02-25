package com.swmansion.rnscreens.fullwindowoverlay

import android.content.Context
import android.graphics.PixelFormat
import android.view.View
import android.view.WindowManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

/**
 * Layout of this component is managed by React & the implementation assumes width & height we receive
 * are the width & height of the window.
 */
class FullWindowOverlay(
    val context: ThemedReactContext,
) : ReactViewGroup(context) {
    internal val hostView = FullWindowOverlayHostView(context, UIManagerHelper.getEventDispatcherForReactTag(context, id)!!, id)

    fun onAddView(
        child: View,
        index: Int,
    ) {
        hostView.addView(child, index)
    }

    fun onRemoveViewAt(index: Int) {
        hostView.removeViewAt(index)
    }

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        if (changed) {
            resolveWindowManager().updateViewLayout(hostView, createLayoutParams(right - left, bottom - top))
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        presentHostViewIfNeeded()
    }

    override fun onDetachedFromWindow() {
        dismissHostViewIfNeeded()
        super.onDetachedFromWindow()
    }

    internal fun presentHostViewIfNeeded() {
        if (!hostView.isAttachedToWindow) {
            resolveWindowManager().addView(hostView, createLayoutParams(1080, 2220))
        }
    }

    internal fun dismissHostViewIfNeeded() {
        if (hostView.isAttachedToWindow) {
            resolveWindowManager().removeView(hostView)
        }
    }

    private fun resolveWindowManager(): WindowManager {
        val maybeWindowManager = context.getSystemService(Context.WINDOW_SERVICE)
        if (maybeWindowManager is WindowManager) {
            return maybeWindowManager
        } else {
            throw IllegalStateException("Failed to resolve window manager from context")
        }
    }

    private fun createLayoutParams(
        width: Int,
        height: Int,
    ): WindowManager.LayoutParams =
        // We don't use LayoutParams.MATCH_PARENT here for width & height, because ViewRootImpl
        // applies top & bottom inset and we don't want this right now.

        WindowManager.LayoutParams(
            width,
            height,
            0,
            0,
            WindowManager.LayoutParams.TYPE_APPLICATION_ATTACHED_DIALOG,
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.RGBA_8888,
        )

    private fun isReactOriginatedMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) = MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY &&
        MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY

    companion object {
        const val TAG = "FullWindowOverlay"
    }
}
