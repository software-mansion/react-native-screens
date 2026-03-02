package com.swmansion.rnscreens.gamma.helpers

import com.facebook.react.bridge.UIManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType

internal fun UIManagerHelper.getFabricUIManagerNotNull(reactContext: ThemedReactContext): UIManager =
    checkNotNull(this.getUIManager(reactContext, UIManagerType.FABRIC)) {
        "[RNScreens] UIManager must not be null"
    }
