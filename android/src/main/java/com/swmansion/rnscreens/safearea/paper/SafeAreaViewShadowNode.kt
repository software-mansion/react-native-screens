// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea.paper

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableType
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.NativeViewHierarchyOptimizer
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.Spacing
import com.facebook.react.uimanager.ViewProps
import com.facebook.react.uimanager.annotations.ReactPropGroup

class SafeAreaViewShadowNode : LayoutShadowNode() {
    private var localData: SafeAreaViewLocalData? = null
    private val margins: FloatArray = FloatArray(ViewProps.PADDING_MARGIN_SPACING_TYPES.size)
    private var needsUpdate = false

    init {
        for (i in ViewProps.PADDING_MARGIN_SPACING_TYPES.indices) {
            margins[i] = Float.NaN
        }
    }

    private fun updateInsets() {
        val localData = localData ?: return
        var left = 0f
        var top = 0f
        var right = 0f
        var bottom = 0f
        val allEdges = margins[Spacing.ALL]
        if (!java.lang.Float.isNaN(allEdges)) {
            left = allEdges
            top = allEdges
            right = allEdges
            bottom = allEdges
        }
        val verticalEdges = margins[Spacing.VERTICAL]
        if (!java.lang.Float.isNaN(verticalEdges)) {
            top = verticalEdges
            bottom = verticalEdges
        }
        val horizontalEdges = margins[Spacing.HORIZONTAL]
        if (!java.lang.Float.isNaN(horizontalEdges)) {
            left = horizontalEdges
            right = horizontalEdges
        }
        val leftEdge = margins[Spacing.LEFT]
        if (!java.lang.Float.isNaN(leftEdge)) {
            left = leftEdge
        }
        val topEdge = margins[Spacing.TOP]
        if (!java.lang.Float.isNaN(topEdge)) {
            top = topEdge
        }
        val rightEdge = margins[Spacing.RIGHT]
        if (!java.lang.Float.isNaN(rightEdge)) {
            right = rightEdge
        }
        val bottomEdge = margins[Spacing.BOTTOM]
        if (!java.lang.Float.isNaN(bottomEdge)) {
            bottom = bottomEdge
        }
        left = PixelUtil.toPixelFromDIP(left)
        top = PixelUtil.toPixelFromDIP(top)
        right = PixelUtil.toPixelFromDIP(right)
        bottom = PixelUtil.toPixelFromDIP(bottom)
        val edges = localData.edges
        val insets = localData.insets

        super.setMargin(Spacing.LEFT, getEdgeValue(edges.left, insets.left, left))
        super.setMargin(Spacing.TOP, getEdgeValue(edges.top, insets.top, top))
        super.setMargin(Spacing.RIGHT, getEdgeValue(edges.right, insets.right, right))
        super.setMargin(Spacing.BOTTOM, getEdgeValue(edges.bottom, insets.bottom, bottom))
    }

    private fun getEdgeValue(
        edgeMode: Boolean,
        insetValue: Float,
        edgeValue: Float,
    ): Float = if (edgeMode) insetValue + edgeValue else edgeValue

    override fun onBeforeLayout(nativeViewHierarchyOptimizer: NativeViewHierarchyOptimizer) {
        if (needsUpdate) {
            needsUpdate = false
            updateInsets()
        }
    }

    override fun setLocalData(data: Any) {
        if (data !is SafeAreaViewLocalData) {
            return
        }
        localData = data
        needsUpdate = false
        updateInsets()
    }

    // Names needs to reflect exact order in LayoutShadowNode.java
    @ReactPropGroup(
        names =
            [
                ViewProps.MARGIN,
                ViewProps.MARGIN_VERTICAL,
                ViewProps.MARGIN_HORIZONTAL,
                ViewProps.MARGIN_START,
                ViewProps.MARGIN_END,
                ViewProps.MARGIN_TOP,
                ViewProps.MARGIN_BOTTOM,
                ViewProps.MARGIN_LEFT,
                ViewProps.MARGIN_RIGHT,
            ],
    )
    override fun setMargins(
        index: Int,
        margin: Dynamic,
    ) {
        val spacingType = ViewProps.PADDING_MARGIN_SPACING_TYPES[index]
        margins[spacingType] =
            if (margin.type == ReadableType.Number) margin.asDouble().toFloat() else Float.NaN
        super.setMargins(index, margin)
        needsUpdate = true
    }
}
