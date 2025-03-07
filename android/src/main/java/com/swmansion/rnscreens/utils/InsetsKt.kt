package com.swmansion.rnscreens.utils

import android.graphics.Insets
import android.os.Build
import android.view.View
import android.view.WindowInsets
import androidx.annotation.RequiresApi

internal data class InsetsCompat(
    val left: Int,
    val top: Int,
    val right: Int,
    val bottom: Int,
) {
    @RequiresApi(Build.VERSION_CODES.Q)
    fun toInsets() = Insets.of(left, top, right, bottom)

    companion object {
        @RequiresApi(Build.VERSION_CODES.Q)
        fun from(insets: Insets) = InsetsCompat(insets.left, insets.top, insets.right, insets.bottom)

        val ZERO = InsetsCompat(0, 0, 0, 0)
    }
}

@RequiresApi(Build.VERSION_CODES.Q)
internal fun Insets.intoInsetsCompat() = InsetsCompat(this.left, this.top, this.right, this.bottom)

// TODO: Consider looking through WindowInsetsCompat API and using it here if feasible
internal fun WindowInsets.resolveDisplayCutoutInsets(): InsetsCompat =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        this.getInsets(WindowInsets.Type.displayCutout()).intoInsetsCompat()
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        val displayCutout = this.displayCutout ?: return InsetsCompat.ZERO
        InsetsCompat(
            displayCutout.safeInsetLeft,
            displayCutout.safeInsetTop,
            displayCutout.safeInsetRight,
            displayCutout.safeInsetBottom,
        )
    } else {
        InsetsCompat.ZERO
    }

internal fun View.resolveDisplayCutoutInsets(sourceWindowInsets: WindowInsets? = null): InsetsCompat =
    (sourceWindowInsets ?: rootWindowInsets).resolveDisplayCutoutInsets()
