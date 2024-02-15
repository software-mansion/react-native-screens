package com.swmansion.rnscreens

import android.view.ViewGroup
import androidx.annotation.UiThread
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.FabricViewStateManager
import kotlin.math.abs

abstract class FabricEnabledViewGroup constructor(context: ReactContext?) : ViewGroup(context), FabricViewStateManager.HasFabricViewStateManager {
    private val mFabricViewStateManager: FabricViewStateManager = FabricViewStateManager()

    private var lastHeaderHeight = 0f

    override fun getFabricViewStateManager(): FabricViewStateManager {
        return mFabricViewStateManager
    }

    protected fun updateHeaderSizeFabric(headerHeight: Double) {
        updateState(headerHeight)
    }

    @UiThread
    fun updateState(headerHeight: Double) {
        // Check incoming state values. If they're already the correct value, return early to prevent
        // infinite UpdateState/SetState loop.
        val delta = 0.9f
        if (abs(lastHeaderHeight - headerHeight) < delta) {
            return
        }

        lastHeaderHeight = headerHeight.toFloat()

        mFabricViewStateManager.setState {
            val map: WritableMap = WritableNativeMap()
            map.putDouble("contentOffsetX", 0.0)
            map.putDouble("contentOffsetY", headerHeight)
            map
        }
    }
}
