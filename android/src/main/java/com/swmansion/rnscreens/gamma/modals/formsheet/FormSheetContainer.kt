package com.swmansion.rnscreens.gamma.modals.formsheet

import android.annotation.SuppressLint
import android.content.Context
import android.view.View
import android.widget.LinearLayout
import com.google.android.material.bottomsheet.BottomSheetDragHandleView

@SuppressLint("ViewConstructor")
class FormSheetContainer(
    context: Context,
    internal val contentView: View,
) : LinearLayout(context) {
    private val grabberView =
        BottomSheetDragHandleView(context).apply {
            layoutParams =
                LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.WRAP_CONTENT,
                )
            visibility = GONE
        }

    init {
        orientation = VERTICAL

        contentView.layoutParams =
            LayoutParams(
                LayoutParams.MATCH_PARENT,
                0,
                1.0f,
            )

        addView(grabberView)
        addView(contentView)
    }

    internal fun setGrabberVisible(visible: Boolean) {
        grabberView.visibility = if (visible) VISIBLE else GONE
    }
}
