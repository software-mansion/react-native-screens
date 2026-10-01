package com.swmansion.rnscreens.stack.header.appbar

import android.graphics.Canvas
import android.graphics.drawable.ColorDrawable
import androidx.core.graphics.withClip

/**
 * Content scrim that can skip the status-bar strip painted by the
 * CollapsingToolbarLayout status bar scrim. Both scrims share the same alpha
 * while fading, so wherever they overlap the strip composites darker than the
 * rest of the scrim during the transition.
 */
internal class StackHeaderContentScrimDrawable(
    color: Int,
) : ColorDrawable(color) {
    // Bottom of the skipped band in CollapsingToolbarLayout coordinates; the
    // visible top edge of the scrim always aligns with the strip top. Values
    // <= bounds.top disable the exclusion.
    internal var exclusionBottom: Int = 0
        set(value) {
            if (field != value) {
                field = value
                invalidateSelf()
            }
        }

    override fun draw(canvas: Canvas) {
        if (exclusionBottom <= bounds.top) {
            super.draw(canvas)
            return
        }
        canvas.withClip(bounds.left, exclusionBottom, bounds.right, bounds.bottom) {
            super.draw(canvas)
        }
    }
}
