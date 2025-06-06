package com.swmansion.rnscreens

import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.NativeViewHierarchyManager
import com.facebook.react.uimanager.NativeViewHierarchyOptimizer
import com.facebook.react.uimanager.UIManagerModule

internal class ScreensShadowNode(
    private var context: ReactContext,
) : LayoutShadowNode() {
    override fun onBeforeLayout(nativeViewHierarchyOptimizer: NativeViewHierarchyOptimizer) {
        super.onBeforeLayout(nativeViewHierarchyOptimizer)
        (context.getNativeModule(UIManagerModule::class.java))?.addUIBlock { nativeViewHierarchyManager: NativeViewHierarchyManager? ->
            if (nativeViewHierarchyManager == null) {
                return@addUIBlock
            }
            val view = nativeViewHierarchyManager.resolveView(reactTag)
            if (view is ScreenContainer) {
                view.performUpdates()
            }
        }
    }
}
