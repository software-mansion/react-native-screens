package com.swmansion.rnscreens.legacy

import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.StateWrapper
import com.swmansion.rnscreens.utils.pxToDp
import kotlin.math.abs

abstract class FabricEnabledViewGroup(
    context: ReactContext?,
) : ViewGroup(context) {
    private var mStateWrapper: StateWrapper? = null

    private var lastWidth = 0f
    private var lastHeight = 0f
    private var lastHeaderHeight = 0f

    protected var isStateInvalidated = false
        private set

    // A detached screen can miss native layout changes while the commit hook resets its shadow state.
    protected fun invalidateState() {
        isStateInvalidated = true
    }

    fun setStateWrapper(wrapper: StateWrapper?) {
        mStateWrapper = wrapper
    }

    @UiThread
    fun updateState(
        width: Int,
        height: Int,
        headerHeight: Int,
    ) {
        // Convert px->dp with this view's own display density (see pxToDp): the global density
        // mis-scales the frame pushed to the Shadow Tree on displays whose density differs from
        // the device's main one (Samsung DeX, freeform multi-window, external monitors). See #4159.
        val realWidth: Float = pxToDp(width.toFloat())
        val realHeight: Float = pxToDp(height.toFloat())
        val realHeaderHeight: Float = pxToDp(headerHeight.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // an infinite UpdateState/SetState loop. The state-invalidated flag forces the update when the
        // commit hook has reset the state while the screen was detached from the native hierarchy
        // - the screen may have missed some layout changes in the meantime (see #4336 and #4760).
        val delta = 0.9f
        if (!isStateInvalidated &&
            abs(lastWidth - realWidth) < delta &&
            abs(lastHeight - realHeight) < delta &&
            abs(lastHeaderHeight - realHeaderHeight) < delta
        ) {
            return
        }

        val stateWrapper = mStateWrapper ?: return
        isStateInvalidated = false
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
        stateWrapper.updateState(map)
    }
}
