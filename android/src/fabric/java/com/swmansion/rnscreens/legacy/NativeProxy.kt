package com.swmansion.rnscreens.legacy

import android.util.Log
import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.fabric.FabricUIManager
import java.lang.ref.WeakReference
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentLinkedQueue

@OptIn(UnstableReactNativeAPI::class)
class NativeProxy : UIManagerListener {
    @DoNotStrip
    @Suppress("unused")
    private val mHybridData: HybridData

    init {
        mHybridData = initHybrid()
    }

    private external fun initHybrid(): HybridData

    external fun nativeAddMutationsListener(fabricUIManager: FabricUIManager)

    external fun cleanupExpiredMountingCoordinators()

    external fun invalidateNative()

    companion object {
        // we use ConcurrentHashMap here since it will be read on the JS thread,
        // and written to on the UI thread.
        private val viewsMap = ConcurrentHashMap<Int, WeakReference<Screen>>()

        // Added by the thread that pulled the transaction removing the screen, drained on the UI
        // thread before that transaction mounts. Shared by all proxies, because the native removal
        // listener notifies only the most recently installed one. Never cleared: invalidating one
        // React instance must not drop another instance's screens.
        private val screensPendingRemovalTransition = ConcurrentLinkedQueue<WeakReference<Screen>>()

        fun addScreenToMap(
            tag: Int,
            view: Screen,
        ) {
            viewsMap[tag] = WeakReference(view)
        }

        fun removeScreenFromMap(tag: Int) {
            viewsMap.remove(tag)
        }

        fun clearMapOnInvalidate() {
            viewsMap.clear()
        }
    }

    // Called from native, on the thread that pulls the mounting transaction: the JS thread in
    // the push model, the UI thread in the pull model or when rendering synchronously.
    @DoNotStrip
    public fun notifyScreenRemoved(screenTag: Int) {
        // Since RN 0.78 the screenTag we receive as argument here might not belong to a screen
        // owned by native stack, but e.g. to one parented by plain ScreenContainer, for which we
        // currently do not want to start exiting transitions. Therefore is it left to caller to
        // ensure that NativeProxy.viewsMap is filled only with screens belonging to screen stacks.

        val weakScreeRef = viewsMap[screenTag]

        // `screenTag` belongs to not observed screen or screen with such tag no longer exists.
        if (weakScreeRef == null) {
            return
        }

        val screen = weakScreeRef.get()
        if (screen is Screen) {
            // The transaction removes the screen's children before the screen, so the transition
            // must start before the transaction mounts. A transaction pulled on the UI thread can't
            // mount before the pull returns.
            if (UiThreadUtil.isOnUiThread()) {
                screen.startRemovalTransition()
            } else {
                screensPendingRemovalTransition.add(weakScreeRef)
            }
        } else {
            Log.w("[RNScreens]", "Reference stored in NativeProxy for tag $screenTag no longer points to valid object.")
        }
    }

    // Fabric calls it on the UI thread before each dispatch of queued mount items, after it has taken
    // those items.
    override fun willMountItems(uiManager: UIManager) {
        generateSequence { screensPendingRemovalTransition.poll() }
            .forEach { it.get()?.startRemovalTransition() }
    }

    override fun didMountItems(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit
}
