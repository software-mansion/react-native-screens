package com.swmansion.rnscreens.react.modals.sheet.contentwrapper

import android.content.Context
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetContentSizeChangeDelegate
import com.swmansion.rnscreens.core.modals.sheet.interfaces.SheetContentSizeChangeProvider

class SheetContentWrapper(
    context: Context,
) : ReactViewGroup(context),
    SheetContentSizeChangeProvider {
    private var delegate: SheetContentSizeChangeDelegate? = null
    private var lastReportedHeight: Int = -1

    override fun setContentSizeChangeDelegate(delegate: SheetContentSizeChangeDelegate?) {
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
