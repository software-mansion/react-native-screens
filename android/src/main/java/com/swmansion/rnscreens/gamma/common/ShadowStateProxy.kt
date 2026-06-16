package com.swmansion.rnscreens.gamma.common

import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.StateWrapper
import com.swmansion.rnscreens.utils.pxToDp
import kotlin.math.abs

internal class ShadowStateProxy(
    private val includesFrameSize: Boolean = true,
) {
    internal var stateWrapper: StateWrapper? = null

    private var lastFrameWidthInDp: Float = 0f
    private var lastFrameHeightInDp: Float = 0f
    private var lastContentOffsetXInDp: Float = 0f
    private var lastContentOffsetYInDp: Float = 0f

    fun updateStateIfNeeded(
        // The display density is supplied per call (not captured once) so it stays correct
        // when the owning view moves between displays of differing density. See pxToDp / #4159.
        density: Float,
        frameWidth: Int? = null,
        frameHeight: Int? = null,
        contentOffsetX: Int? = null,
        contentOffsetY: Int? = null,
    ) {
        val widthInDp = frameWidth?.let { pxToDp(it.toFloat(), density) } ?: lastFrameWidthInDp
        val heightInDp = frameHeight?.let { pxToDp(it.toFloat(), density) } ?: lastFrameHeightInDp
        val offsetXInDp = contentOffsetX?.let { pxToDp(it.toFloat(), density) } ?: lastContentOffsetXInDp
        val offsetYInDp = contentOffsetY?.let { pxToDp(it.toFloat(), density) } ?: lastContentOffsetYInDp

        if (
            abs(lastFrameWidthInDp - widthInDp) < DELTA &&
            abs(lastFrameHeightInDp - heightInDp) < DELTA &&
            abs(lastContentOffsetXInDp - offsetXInDp) < DELTA &&
            abs(lastContentOffsetYInDp - offsetYInDp) < DELTA
        ) {
            return
        }

        lastFrameWidthInDp = widthInDp
        lastFrameHeightInDp = heightInDp
        lastContentOffsetXInDp = offsetXInDp
        lastContentOffsetYInDp = offsetYInDp

        val map =
            WritableNativeMap().apply {
                if (includesFrameSize) {
                    putDouble("frameWidth", widthInDp.toDouble())
                    putDouble("frameHeight", heightInDp.toDouble())
                }
                putDouble("contentOffsetX", offsetXInDp.toDouble())
                putDouble("contentOffsetY", offsetYInDp.toDouble())
            }
        stateWrapper?.updateState(map)
    }

    companion object {
        private const val DELTA = 0.1f
    }
}
