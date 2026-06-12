package com.swmansion.rnscreens

import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import kotlin.math.abs

abstract class FabricEnabledViewGroup(
    context: ReactContext?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    private var lastWidth = 0f
    private var lastHeight = 0f
    private var lastHeaderHeight = 0f

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    @UiThread
    fun updateState(
        width: Int,
        height: Int,
        headerHeight: Int,
    ) {
        // Use the density of the display this view is attached to, not the process-global one
        // captured from the device's main display (PixelUtil). Fabric mounts views using the
        // per-display density, so converting back with the global density shrinks/inflates the
        // frame pushed to the Shadow Tree whenever the app runs on a display with a different
        // density (Samsung DeX, freeform multi-window, external monitors). Both densities are
        // identical on single-display devices, so this is a no-op there. See #4159.
        val density = context.resources.displayMetrics.density
        val realWidth: Float = if (density > 0f) width / density else PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = if (density > 0f) height / density else PixelUtil.toDIPFromPixel(height.toFloat())
        val realHeaderHeight: Float = if (density > 0f) headerHeight / density else PixelUtil.toDIPFromPixel(headerHeight.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        val delta = 0.9f
        if (abs(lastWidth - realWidth) < delta &&
            abs(lastHeight - realHeight) < delta &&
            abs(lastHeaderHeight - realHeaderHeight) < delta
        ) {
            return
        }

        lastWidth = realWidth
        lastHeight = realHeight
        lastHeaderHeight = realHeaderHeight
        val map: WritableMap =
            WritableNativeMap().apply {
                putDouble("frameWidth", realWidth.toDouble())
                putDouble("frameHeight", realHeight.toDouble())
                putDouble("contentOffsetX", 0.0)
                putDouble("contentOffsetY", realHeaderHeight.toDouble())
            }
        mStateWrapper?.updateState(map)
    }
}
