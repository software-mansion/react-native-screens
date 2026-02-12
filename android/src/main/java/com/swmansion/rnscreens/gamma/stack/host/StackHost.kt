package com.swmansion.rnscreens.gamma.stack.host

import android.annotation.SuppressLint
import android.util.Log
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
    private val containerUpdateCoordinator = StackContainerUpdateCoordinator()

    init {
        addView(container)

        // We're adding ourselves during a batch, therefore we expect to receive its finalization callbacks
        val uiManager =
            checkNotNull(UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC)) {
                "[RNScreens] UIManager must not be null."
            }
        uiManager.addUIManagerEventListener(this)
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
        addPushOperationIfNeeded(stackScreen)
    }

    internal fun unmountReactSubviewAt(index: Int) {
        val removedScreen = renderedScreens.removeAt(index)
        addPopOperationIfNeeded(removedScreen)
    }

    internal fun unmountReactSubview(reactSubview: StackScreen) {
        renderedScreens.remove(reactSubview)
        addPopOperationIfNeeded(reactSubview)
    }

    internal fun unmountAllReactSubviews() {
        renderedScreens.asReversed().forEach {
            addPopOperationIfNeeded(it)
        }
        renderedScreens.clear()
    }

    private fun addPushOperationIfNeeded(stackScreen: StackScreen) {
        if (stackScreen.activityMode == StackScreen.ActivityMode.ATTACHED) {
            containerUpdateCoordinator.addPushOperation(stackScreen)
        }
    }

    private fun addPopOperationIfNeeded(stackScreen: StackScreen) {
        if (stackScreen.activityMode == StackScreen.ActivityMode.ATTACHED && !stackScreen.isNativelyDismissed) {
            // This shouldn't happen in typical scenarios but it can happen with fast-refresh.
            containerUpdateCoordinator.addPopOperation(stackScreen)
        } else {
            Log.d(TAG, "Ignoring pop operation of ${stackScreen.screenKey}, already not attached or natively dismissed")
        }
    }

    internal fun stackScreenChangedActivityMode(stackScreen: StackScreen) {
        when (stackScreen.activityMode) {
            StackScreen.ActivityMode.DETACHED -> containerUpdateCoordinator.addPopOperation(stackScreen)
            StackScreen.ActivityMode.ATTACHED -> containerUpdateCoordinator.addPushOperation(stackScreen)
        }
    }

    override fun onScreenDismiss(stackScreen: StackScreen) {
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
        containerUpdateCoordinator.executePendingOperationsIfNeeded(container, renderedScreens)
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun willMountItems(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    companion object {
        const val TAG = "StackHost"
    }
}
