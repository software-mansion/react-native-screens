package com.swmansion.rnscreens.gamma.stack.host

import android.annotation.SuppressLint
import android.view.ViewGroup
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.swmansion.rnscreens.gamma.stack.screen.StackScreen
import com.swmansion.rnscreens.utils.RNSLog
import java.lang.ref.WeakReference

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor") // should never be restored
class StackHost(
    private val reactContext: ThemedReactContext,
) : ViewGroup(reactContext),
    UIManagerListener,
    StackContainerDelegate {
    internal val renderedScreens: ArrayList<StackScreen> = arrayListOf()
    private val container = StackContainer(reactContext, WeakReference(this))

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
        stackScreen.stackHost = WeakReference(this)
        enqueueAddOperationToContainerIfNeeded(stackScreen)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        val removedScreen = renderedScreens.removeAt(index)
        enqueuePopOperationToContainerIfNeeded(removedScreen)
    }

    internal fun unmountReactSubview(reactSubview: StackScreen) {
        renderedScreens.remove(reactSubview)
        enqueuePopOperationToContainerIfNeeded(reactSubview)
    }

    internal fun unmountAllReactSubviews() {
        renderedScreens.asReversed().forEach {
            enqueuePopOperationToContainerIfNeeded(it)
        }
        renderedScreens.clear()
    }

    private fun enqueueAddOperationToContainerIfNeeded(stackScreen: StackScreen) {
        if (stackScreen.activityMode == StackScreen.ActivityMode.ATTACHED) {
            container.enqueueAddOperation(stackScreen)
        }
    }

    private fun enqueuePopOperationToContainerIfNeeded(stackScreen: StackScreen) {
        if (stackScreen.activityMode == StackScreen.ActivityMode.ATTACHED && !stackScreen.isNativelyDismissed) {
            container.enqueuePopOperation(stackScreen)
        }
    }

    internal fun stackScreenChangedActivityMode(stackScreen: StackScreen) {
        when (stackScreen.activityMode) {
            StackScreen.ActivityMode.DETACHED -> container.enqueuePopOperation(stackScreen)
            StackScreen.ActivityMode.ATTACHED -> container.enqueueAddOperation(stackScreen)
        }
    }

    override fun onDismiss(stackScreen: StackScreen) {
        if (stackScreen.activityMode == StackScreen.ActivityMode.ATTACHED) {
            stackScreen.isNativelyDismissed = true
        }
    }

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
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

    companion object {
        const val TAG = "StackHost"
    }
}
