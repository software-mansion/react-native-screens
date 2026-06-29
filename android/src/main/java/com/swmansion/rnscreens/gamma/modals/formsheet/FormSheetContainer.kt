package com.swmansion.rnscreens.gamma.modals.formsheet

import android.annotation.SuppressLint
import android.content.Context
import android.widget.FrameLayout

@SuppressLint("ViewConstructor")
class FormSheetContainer(
    context: Context,
    onContentSizeChanged: (width: Int, height: Int) -> Unit,
) : FrameLayout(context) {
    internal val contentView =
        FormSheetContentView(context, onContentSizeChanged).apply {
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        }

    init {
        addView(contentView)
    }
}
