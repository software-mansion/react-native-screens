package com.swmansion.rnscreens

import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.FabricViewStateManager
import com.facebook.react.uimanager.PixelUtil
import kotlin.math.abs

abstract class FabricEnabledViewGroup constructor(context: ReactContext?) : ViewGroup(context), FabricViewStateManager.HasFabricViewStateManager {
    private val mFabricViewStateManager: FabricViewStateManager = FabricViewStateManager()

    private var lastSetWidth = 0f
    private var lastSetHeight = 0f

    override fun getFabricViewStateManager(): FabricViewStateManager {
        return mFabricViewStateManager
    }

    protected fun updateScreenSizeFabric(width: Int, height: Int, headerHeight: Double) {
        updateState(width, height, headerHeight)
    }

    @UiThread
    fun updateState(width: Int, height: Int, headerHeight: Double) {
        val realWidth: Float = PixelUtil.toDIPFromPixel(width.toFloat())
        val realHeight: Float = PixelUtil.toDIPFromPixel(height.toFloat())

        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        val delta = 0.9f
        if (abs(lastSetWidth - realWidth) < delta &&
            abs(lastSetHeight - realHeight) < delta
        ) {
            return
        }

        lastSetWidth = realWidth
        lastSetHeight = realHeight

        mFabricViewStateManager.setState {
            val map: WritableMap = WritableNativeMap()
            map.putDouble("frameWidth", realWidth.toDouble())
            map.putDouble("frameHeight", realHeight.toDouble())
            map.putDouble("contentOffsetX", 0.0)
            map.putDouble("contentOffsetY", headerHeight)
            map
        }
    }
}
