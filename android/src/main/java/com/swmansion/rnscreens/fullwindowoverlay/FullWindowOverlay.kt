package com.swmansion.rnscreens.fullwindowoverlay

import android.content.Context
import android.graphics.PixelFormat
import android.util.Log
import android.view.View
import android.view.WindowManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

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

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        if (isReactOriginatedMeasure(widthMeasureSpec, heightMeasureSpec)) {
            val width = MeasureSpec.getSize(widthMeasureSpec)
            val height = MeasureSpec.getSize(heightMeasureSpec)
//            hostView.measure(widthMeasureSpec, heightMeasureSpec)
            Log.i(TAG, "onMeasure - React $width, $height")
        }
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        val windowManager = resolveWindowManager()

        Log.i(TAG, "onAttachedToWindow")

        if (isLaidOut) {
            Log.i(TAG, "already laid out")
        } else {
            Log.e(TAG, "not laid out")
        }

        val hostLayoutParams =
            WindowManager.LayoutParams(
                1080,
                2220,
                0,
                0,
                WindowManager.LayoutParams.TYPE_APPLICATION_ATTACHED_DIALOG,
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                PixelFormat.RGBA_8888,
            )
        windowManager.addView(hostView, hostLayoutParams)
    }

    override fun onDetachedFromWindow() {
        val windowManager = resolveWindowManager()
        windowManager.removeView(hostView)

        super.onDetachedFromWindow()
    }

    private fun resolveWindowManager(): WindowManager {
        val maybeWindowManager = context.getSystemService(Context.WINDOW_SERVICE)
        if (maybeWindowManager is WindowManager) {
            return maybeWindowManager
        } else {
            throw IllegalStateException("Failed to resolve window manager from context")
        }
    }

    private fun isReactOriginatedMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) = MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY &&
        MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY

    companion object {
        const val TAG = "FullWindowOverlay"
    }
}
