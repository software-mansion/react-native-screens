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

    /**
     * Semantics: true iff we **believe** that SurfaceMountingManager has measured this view during mount item
     * execution. We recognize this case by checking measure mode in `onMeasure`. If Androidx
     * happens to use `EXACTLY` for both dimensions this property might convey invalid information.
     */
    private var isReactSizeSet = false

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
            // dimensions provided by react (with high probability)
            reactWidth = MeasureSpec.getSize(widthMeasureSpec)
            reactHeight = MeasureSpec.getSize(heightMeasureSpec)
            isReactSizeSet = true
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

            // When setting subviews via `setOptions` from `useEffect` hook in a component, the first
            // frame received might be computed by native layout & completely invalid (zero height).
            // RN layout is the source of subview **size** (not origin) & we need to avoid sending
            // this native size to ST. Doing otherwise might lead to problems.
            // See: https://github.com/software-mansion/react-native-screens/pull/2812
            if (isReactSizeSet) {
                updateSubviewFrameState(width, height, l, t)
            }
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
