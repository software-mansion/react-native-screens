package com.swmansion.rnscreens.gamma.helpers

import android.content.res.ColorStateList
import android.content.res.Resources
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

    override fun getConstantState(): ConstantState? = drawable?.constantState?.let(::NoTintConstantState)

    private class NoTintConstantState(
        private val wrappedState: ConstantState,
    ) : ConstantState() {
        override fun newDrawable(): Drawable = NoTintDrawable(wrappedState.newDrawable())

        override fun newDrawable(res: Resources?): Drawable = NoTintDrawable(wrappedState.newDrawable(res))

        override fun getChangingConfigurations(): Int = wrappedState.changingConfigurations
    }
}
