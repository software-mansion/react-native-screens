package com.swmansion.rnscreens.utils

import android.os.Build
import android.view.View
import androidx.annotation.RequiresApi
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

object DecorViewInsetsUtils {
    /**
     * Retrieves the top system inset (such as status bar or display cutout) from the given decor view.
     *
     * @param decorView The top-level window decor view.
     * @return The top inset in pixels.
     */
    internal fun getDecorViewTopInset(decorView: View): Int {
        val insetsCompat = ViewCompat.getRootWindowInsets(decorView) ?: return 0

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getTopInsetModern(insetsCompat)
        } else {
            @Suppress("DEPRECATION")
            insetsCompat.systemWindowInsetTop
        }
    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun getTopInsetModern(insetsCompat: WindowInsetsCompat): Int =
        insetsCompat
            .getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout(),
            ).top
}
