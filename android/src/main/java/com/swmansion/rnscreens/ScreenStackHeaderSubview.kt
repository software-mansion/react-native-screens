package com.swmansion.rnscreens

import android.annotation.SuppressLint
import android.view.View
import com.facebook.react.bridge.ReactContext

@SuppressLint("ViewConstructor")
class ScreenStackHeaderSubview(
    context: ReactContext?,
) : FabricEnabledHeaderSubviewViewGroup(context) {
    private var reactWidth = 0
    private var reactHeight = 0
    var type = Type.RIGHT

    val config: ScreenStackHeaderConfig?
        get() = (parent as? CustomToolbar)?.config

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        if (MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY &&
            MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY
        ) {
            // dimensions provided by react
            reactWidth = MeasureSpec.getSize(widthMeasureSpec)
            reactHeight = MeasureSpec.getSize(heightMeasureSpec)
            val parent = parent
            if (parent != null) {
                forceLayout()
                (parent as View).requestLayout()
            }
        }
        setMeasuredDimension(reactWidth, reactHeight)
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        if (changed && BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            val width = r - l
            val height = b - t
            updateSubviewFrameState(width, height, l, t)
        }
    }

    enum class Type {
        LEFT,
        CENTER,
        RIGHT,
        BACK,
        SEARCH_BAR,
    }
}
