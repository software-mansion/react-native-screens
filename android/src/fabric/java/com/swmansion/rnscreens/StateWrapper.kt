package com.swmansion.rnscreens

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.FabricViewStateManager

class StateWrapper {
    companion object {
        fun getStateData(state: FabricViewStateManager): ReadableMap? {
            return state.getStateData()
        }
    }
}
