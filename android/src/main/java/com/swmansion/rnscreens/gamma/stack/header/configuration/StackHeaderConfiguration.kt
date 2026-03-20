package com.swmansion.rnscreens.gamma.stack.header.configuration

import android.annotation.SuppressLint
import com.facebook.react.bridge.ReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubview
import com.swmansion.rnscreens.gamma.stack.header.subview.StackHeaderSubviewType
import java.lang.ref.WeakReference

@SuppressLint("ViewConstructor")
class StackHeaderConfiguration(
    val reactContext: ReactContext,
) : ReactViewGroup(reactContext),
    StackHeaderConfigurationProviding {
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

    internal var configurationChangeListener: WeakReference<StackHeaderConfigurationChangeListener>? = null

    internal fun notifyConfigurationChanged() {
        configurationChangeListener?.get()?.onHeaderConfigurationChanged(this)
    }

    private val subviewLayoutChangeListener =
        OnLayoutChangeListener { _, left, _, right, _, oldLeft, _, oldRight, _ ->
            val widthChanged = (right - left) != (oldRight - oldLeft)
            if (widthChanged) {
                notifyConfigurationChanged()
            }
        }

    internal fun addConfigSubview(headerSubview: StackHeaderSubview) {
        when (headerSubview.type) {
            StackHeaderSubviewType.LEFT -> leftSubview = headerSubview
            StackHeaderSubviewType.CENTER -> centerSubview = headerSubview
            StackHeaderSubviewType.RIGHT -> rightSubview = headerSubview
        }
        headerSubview.addOnLayoutChangeListener(subviewLayoutChangeListener)
        notifyConfigurationChanged()
    }

    internal fun removeConfigSubview(headerSubview: StackHeaderSubview) {
        headerSubview.removeOnLayoutChangeListener(subviewLayoutChangeListener)
        when (headerSubview.type) {
            StackHeaderSubviewType.LEFT -> leftSubview = null
            StackHeaderSubviewType.CENTER -> centerSubview = null
            StackHeaderSubviewType.RIGHT -> rightSubview = null
        }
        notifyConfigurationChanged()
    }

    internal fun removeConfigSubviewAt(index: Int) {
        getConfigSubviewAt(index)?.let { removeConfigSubview(it) }
    }

    internal fun removeAllConfigSubviews() {
        leftSubview = null
        centerSubview = null
        rightSubview = null

        notifyConfigurationChanged()
    }

    internal val configSubviewsCount: Int
        get() = listOfNotNull(leftSubview, centerSubview, rightSubview).size

    internal fun getConfigSubviewAt(index: Int): StackHeaderSubview? =
        listOfNotNull(leftSubview, centerSubview, rightSubview).getOrNull(index)
}
