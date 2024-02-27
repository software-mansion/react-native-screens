package com.swmansion.rnscreens.bottomsheet

import android.annotation.SuppressLint
import android.graphics.Outline
import android.graphics.Rect
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.view.ViewOutlineProvider

class CustomOutlineProvider(val cornerRadius: Float) : ViewOutlineProvider() {
//    private val path = Path().apply {
//        addRoundRect()
//        ShapeDrawable
//    }

    @SuppressLint("RestrictedApi")
    override fun getOutline(view: View?, outline: Outline?) {
        val rect = Rect()
        view?.background?.copyBounds(rect)
//        rect.offset(0, 100)
        outline?.setRoundRect(rect, cornerRadius)

        val drawable = GradientDrawable()

//        DrawableUtils.setOutlineToPath(outline!!, path!!)
    }
}
