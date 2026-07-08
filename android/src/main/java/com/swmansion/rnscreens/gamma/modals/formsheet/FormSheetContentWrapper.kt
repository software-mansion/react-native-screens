package com.swmansion.rnscreens.gamma.modals.formsheet

import android.content.Context
import com.facebook.react.views.view.ReactViewGroup

class FormSheetContentWrapper(
    context: Context,
) : ReactViewGroup(context),
    FormSheetContentSizeChangeProvider {
    private var delegate: FormSheetContentSizeChangeDelegate? = null
    private var lastReportedHeight: Int = -1

    override fun setContentSizeChangeDelegate(delegate: FormSheetContentSizeChangeDelegate?) {
        this.delegate = delegate
    }

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        super.onLayout(changed, left, top, right, bottom)

        val currentHeight = bottom - top

        if (currentHeight != lastReportedHeight) {
            lastReportedHeight = currentHeight
            delegate?.onContentHeightChanged(currentHeight)
        }
    }
}
