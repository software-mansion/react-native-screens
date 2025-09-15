package com.swmansion.rnscreens.safearea

import androidx.core.graphics.Insets
import kotlin.math.max

data class EdgeInsets(
    val top: Float,
    val right: Float,
    val bottom: Float,
    val left: Float,
) {
    companion object {
        val NONE: EdgeInsets = EdgeInsets(0.0f, 0.0f, 0.0f, 0.0f)

        fun fromInsets(insets: Insets) =
            EdgeInsets(
                insets.top.toFloat(),
                insets.right.toFloat(),
                insets.bottom.toFloat(),
                insets.left.toFloat(),
            )

        fun max(
            i1: EdgeInsets,
            i2: EdgeInsets,
        ) = EdgeInsets(
            max(i1.top, i2.top),
            max(i1.right, i2.right),
            max(i1.bottom, i2.bottom),
            max(i1.left, i2.left),
        )
    }
}
