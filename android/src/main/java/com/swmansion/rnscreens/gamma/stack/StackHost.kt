package com.swmansion.rnscreens.gamma.stack

import android.annotation.SuppressLint
import android.view.ViewGroup
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.swmansion.rnscreens.gamma.common.container.ContainerInterface
import com.swmansion.rnscreens.gamma.common.container.ContainerUpdateScheduler
import com.swmansion.rnscreens.utils.RNSLog

private class StackHostSignals(var childrenChanged: Boolean = false) {
    fun reset() {
        childrenChanged = false
    }
}

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor") // should never be restored
class StackHost(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext), ContainerInterface<StackHostSignals>, UIManagerListener {
    internal val renderedScreens: ArrayList<StackScreen> = arrayListOf()

    private val signals = StackHostSignals()

    private val updateManager = UpdateManager(ContainerUpdateScheduler<StackHost>())

    private val container = StackContainer(reactContext)

    init {
        addView(container)

        // We're adding ourselves during a batch, therefore we expect to receive its finalization callbacks
        UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC)?.addUIManagerEventListener(this)
    }

    override fun onAttachedToWindow() {
        RNSLog.d(TAG, "StackHost [$id] attached to window")
        super.onAttachedToWindow()
    }

    internal fun mountReactSubviewAt(
        stackScreen: StackScreen,
        index: Int,
    ) {
        renderedScreens.add(index, stackScreen)
        container.addScreen(stackScreen)
//        updateManager.onChildrenChange(signals)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        renderedScreens.removeAt(index)
//        updateManager.onChildrenChange(signals)
    }

    internal fun unmountReactSubview(reactSubview: StackScreen) {
        renderedScreens.remove(reactSubview)
//        updateManager.onChildrenChange(signals)
    }

    internal fun unmountAllReactSubviews() {
        renderedScreens.clear()
//        updateManager.onChildrenChange(signals)
    }


    override fun update() {
        RNSLog.d(TAG, "Running update")
        signals.reset()
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        container.measure(widthMeasureSpec, heightMeasureSpec)
    }

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        container.layout(l, t, r, b)
    }


    override fun didMountItems(uiManager: UIManager) {
        container.performContainerUpdateIfNeeded()
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun willMountItems(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    private inner class UpdateManager(val scheduler: ContainerUpdateScheduler<StackHost>) {
        fun onChildrenChange(signals: StackHostSignals) {
            signals.childrenChanged = true
            scheduler.postContainerUpdateIfNeeded(this@StackHost)
        }
    }

    companion object {
        const val TAG = "StackHost"
    }
}
