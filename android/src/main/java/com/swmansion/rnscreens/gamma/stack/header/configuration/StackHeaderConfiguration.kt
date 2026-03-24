package com.swmansion.rnscreens.gamma.stack.header.configuration

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.common.ShadowStateProxy
import com.swmansion.rnscreens.gamma.stack.header.subview.OnStackHeaderSubviewChangeListener
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor")
class StackHeaderConfiguration(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderConfigurationProviding,
    OnStackHeaderSubviewChangeListener {
    override var type: StackHeaderType = StackHeaderType.SMALL
    override var title: String = ""
    override var hidden: Boolean = false
    override var transparent: Boolean = false

    override var leftSubview: StackHeaderSubview? = null
        private set
    override var centerSubview: StackHeaderSubview? = null
        private set
    override var rightSubview: StackHeaderSubview? = null
        private set
    override var backgroundSubview: StackHeaderSubview? = null
        private set

    private val shadowStateProxy = ShadowStateProxy()

    var stateWrapper by shadowStateProxy::stateWrapper

    override fun updateHeaderFrame(width: Int, height: Int, contentOffsetY: Int) {
        shadowStateProxy.updateStateIfNeeded(
            frameWidth = width,
            frameHeight = height,
            contentOffsetY = contentOffsetY,
        )
    }

    internal var onConfigurationChangeListener: WeakReference<OnHeaderConfigurationChangeListener>? = null

    internal fun notifyConfigurationChanged() {
        onConfigurationChangeListener?.get()?.onHeaderConfigurationChange(this)
    }

    override fun onStackHeaderSubviewChange() = notifyConfigurationChanged()

    internal fun addConfigSubview(headerSubview: StackHeaderSubview) {
        when (headerSubview.type) {
            StackHeaderSubviewType.LEFT -> leftSubview = headerSubview
            StackHeaderSubviewType.CENTER -> centerSubview = headerSubview
            StackHeaderSubviewType.RIGHT -> rightSubview = headerSubview
            StackHeaderSubviewType.BACKGROUND -> backgroundSubview = headerSubview
        }
        headerSubview.onStackHeaderSubviewChangeListener = WeakReference(this)
        notifyConfigurationChanged()
    }

    internal fun removeConfigSubview(headerSubview: StackHeaderSubview) {
        headerSubview.onStackHeaderSubviewChangeListener = null
        when (headerSubview.type) {
            StackHeaderSubviewType.LEFT -> leftSubview = null
            StackHeaderSubviewType.CENTER -> centerSubview = null
            StackHeaderSubviewType.RIGHT -> rightSubview = null
            StackHeaderSubviewType.BACKGROUND -> backgroundSubview = null
        }
        notifyConfigurationChanged()
    }

    internal fun removeConfigSubviewAt(index: Int) {
        getConfigSubviewAt(index)?.let { removeConfigSubview(it) }
    }

    internal fun removeAllConfigSubviews() {
        leftSubview?.let { removeConfigSubview(it) }
        centerSubview?.let { removeConfigSubview(it) }
        rightSubview?.let { removeConfigSubview(it) }
        backgroundSubview?.let { removeConfigSubview(it) }
    }

    internal val configSubviewsCount: Int
        get() = listOfNotNull(leftSubview, centerSubview, rightSubview, backgroundSubview).size

    internal fun getConfigSubviewAt(index: Int): StackHeaderSubview? =
        listOfNotNull(leftSubview, centerSubview, rightSubview, backgroundSubview).getOrNull(index)
}
