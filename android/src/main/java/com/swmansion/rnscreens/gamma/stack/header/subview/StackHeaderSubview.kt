package com.swmansion.rnscreens.gamma.stack.header.subview

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.ext.parentAsView
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import java.lang.ref.WeakReference
import kotlin.properties.Delegates

@SuppressLint("ViewConstructor")
class StackHeaderSubview(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderSubviewProviding {
    override var type: StackHeaderSubviewType = StackHeaderSubviewType.CENTER
        internal set

    override var collapseMode: StackHeaderSubviewCollapseMode by Delegates.observable(
        StackHeaderSubviewCollapseMode.OFF,
    ) { _, oldValue, newValue ->
        if (oldValue != newValue) {
            onStackHeaderSubviewChangeListener?.get()?.onStackHeaderSubviewChange()
        }
    }
        internal set

    override val view = this

    private val shadowStateProxy = ShadowStateProxy(includesFrameSize = false)

    internal var stateWrapper by shadowStateProxy::stateWrapper

    override fun updateContentOriginOffset(
        x: Int,
        y: Int,
    ) {
        shadowStateProxy.updateStateIfNeeded(contentOffsetX = x, contentOffsetY = y)
    }

    internal var onStackHeaderSubviewChangeListener: WeakReference<OnStackHeaderSubviewChangeListener>? = null

    private var yogaWidth: Int = 0
    private var yogaHeight: Int = 0

    // Rely on Yoga layout instead of native Toolbar layout which stretches subview to match parent.
    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        var invalidated = false

        // SurfaceMountingManager always delivers Yoga dimensions as EXACTLY specs.
        // Cache them so we can report the correct size when the Toolbar remeasures us.
        if (MeasureSpec.getMode(widthMeasureSpec) == MeasureSpec.EXACTLY) {
            val newWidth = MeasureSpec.getSize(widthMeasureSpec)
            if (newWidth != yogaWidth) {
                yogaWidth = newWidth
                invalidated = true
            }
        }

        if (MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY) {
            val newHeight = MeasureSpec.getSize(heightMeasureSpec)
            if (newHeight != yogaHeight) {
                yogaHeight = newHeight
                invalidated = true
            }
        }

        setMeasuredDimension(yogaWidth, yogaHeight)
        if (invalidated && !isInLayout) {
            requestLayout()
        }
    }

    override fun requestLayout() {
        // This super is called to avoid a warning but ReactViewGroup.requestLayout is a no-op.
        super.requestLayout()

        // Invalidate layout flags.
        forceLayout()

        // Rely on parent to request the layout.
        parentAsView()?.requestLayout()
    }
}
