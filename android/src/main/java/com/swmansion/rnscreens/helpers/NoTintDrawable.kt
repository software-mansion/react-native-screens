package com.swmansion.rnscreens.helpers

import android.content.res.ColorStateList
import android.graphics.PorterDuff
import android.graphics.drawable.Drawable
import androidx.appcompat.graphics.drawable.DrawableWrapperCompat

// Ignores tinting so the wrapped icon keeps its own colors even when a host view
// (e.g. BottomNavigationView) applies an itemIconTintList.
internal class NoTintDrawable(
    drawable: Drawable,
) : DrawableWrapperCompat(drawable) {
    override fun setTintList(tint: ColorStateList?) = Unit

    override fun setTint(tintColor: Int) = Unit

    override fun setTintMode(tintMode: PorterDuff.Mode?) = Unit
}
