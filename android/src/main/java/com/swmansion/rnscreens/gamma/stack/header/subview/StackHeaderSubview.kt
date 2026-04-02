package com.swmansion.rnscreens.gamma.stack.header.subview

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
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

    private var lastNotifiedSize: Pair<Int, Int>? = null

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        super.onLayout(changed, left, top, right, bottom)
        val newSize = (right - left) to (bottom - top)
        if (lastNotifiedSize != newSize) {
            lastNotifiedSize = newSize
            onStackHeaderSubviewChangeListener?.get()?.onStackHeaderSubviewChange()
        }
    }

    // Rely on Yoga layout instead of native Toolbar layout which stretches subview to match parent.
    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        if (width > 0 && height > 0) {
            setMeasuredDimension(width, height)
        } else {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        }
    }
}
