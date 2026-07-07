package com.swmansion.rnscreens.gamma.stack.header

import android.graphics.drawable.Drawable
import android.util.TypedValue
import androidx.core.graphics.drawable.toBitmap
import androidx.core.graphics.drawable.toDrawable
import com.google.android.material.appbar.MaterialToolbar

/**
 * Returns [drawable] resized to 24 dp height. Width is scaled proportionally to keep the aspect
 * ratio.
 *
 * Icon size source: https://m3.material.io/components/app-bars/specs - App bar icon size
 */
internal fun getResizedDrawable(
    toolbar: MaterialToolbar,
    drawable: Drawable,
): Drawable {
    val targetHeightPx =
        TypedValue
            .applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                24f,
                toolbar.resources.displayMetrics,
            ).toInt()

    val intrinsicWidth = drawable.intrinsicWidth
    val intrinsicHeight = drawable.intrinsicHeight

    val targetWidthPx =
        if (intrinsicWidth > 0 && intrinsicHeight > 0) {
            val aspectRatio = intrinsicWidth.toFloat() / intrinsicHeight.toFloat()
            (targetHeightPx * aspectRatio).toInt()
        } else {
            targetHeightPx
        }

    val bitmap = drawable.toBitmap(width = targetWidthPx, height = targetHeightPx)
    bitmap.density = toolbar.resources.displayMetrics.densityDpi
    return bitmap.toDrawable(toolbar.resources)
}
