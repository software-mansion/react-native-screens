package com.swmansion.rnscreens.gamma.modals.formsheet

import android.annotation.SuppressLint
import android.content.Context
import com.facebook.react.views.view.ReactViewGroup

@SuppressLint("ViewConstructor")
class FormSheetContentView(
    context: Context,
    private val onSizeChangedCallback: (width: Int, height: Int) -> Unit,
) : ReactViewGroup(context) {

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w != oldw || h != oldh) {
            onSizeChangedCallback(w, h)
        }
    }
}
