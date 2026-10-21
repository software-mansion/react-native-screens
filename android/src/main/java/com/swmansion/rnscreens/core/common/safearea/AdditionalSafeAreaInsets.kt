package com.swmansion.rnscreens.core.common.safearea

import android.view.View
import android.view.WindowInsets
import androidx.core.graphics.Insets
import androidx.core.view.WindowInsetsCompat

/**
 * Returns [insets] with the safe area grown by [additionalInsets]: the top edge is added to the
 * status bars insets and the other edges to the navigation bars insets, on top of the current
 * system bars and display cutout insets of that edge. Edges with no additional inset are left as is.
 */
internal fun insetsWithAdditionalSafeArea(
    view: View,
    insets: WindowInsets,
    additionalInsets: Insets,
): WindowInsets {
    val insetsCompat = WindowInsetsCompat.toWindowInsetsCompat(insets, view)
    val safeArea =
        insetsCompat.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
    val statusBars = insetsCompat.getInsets(WindowInsetsCompat.Type.statusBars())
    val navigationBars = insetsCompat.getInsets(WindowInsetsCompat.Type.navigationBars())

    fun grow(
        current: Int,
        safe: Int,
        additional: Int,
    ) = if (additional == 0) current else safe + additional

    return WindowInsetsCompat
        .Builder(insetsCompat)
        .setInsets(
            WindowInsetsCompat.Type.statusBars(),
            Insets.of(
                statusBars.left,
                grow(statusBars.top, safeArea.top, additionalInsets.top),
                statusBars.right,
                statusBars.bottom,
            ),
        ).setInsets(
            WindowInsetsCompat.Type.navigationBars(),
            Insets.of(
                grow(navigationBars.left, safeArea.left, additionalInsets.left),
                navigationBars.top,
                grow(navigationBars.right, safeArea.right, additionalInsets.right),
                grow(navigationBars.bottom, safeArea.bottom, additionalInsets.bottom),
            ),
        ).build()
        .toWindowInsets() ?: insets
}
