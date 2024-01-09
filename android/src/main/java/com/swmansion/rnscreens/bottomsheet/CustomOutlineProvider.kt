package com.swmansion.rnscreens.bottomsheet

import android.graphics.Outline
import android.graphics.Rect
import android.view.View
import android.view.ViewOutlineProvider

class CustomOutlineProvider(val cornerRadius: Float) : ViewOutlineProvider() {
    override fun getOutline(view: View?, outline: Outline?) {
        val rect = Rect()
        view?.background?.copyBounds(rect)
        rect.offset(0, 5)
        outline?.setRoundRect(rect, cornerRadius)
    }
}