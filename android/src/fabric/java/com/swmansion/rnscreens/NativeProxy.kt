package com.swmansion.rnscreens

import android.util.Log
import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.fabric.FabricUIManager
import com.swmansion.rnscreens.legacy.Screen
import com.swmansion.rnscreens.legacy.ScreenDismissSnapshot
import java.lang.ref.WeakReference
import java.util.concurrent.ConcurrentHashMap

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

    // Screens that an upcoming, not yet executed transaction dismisses.
    // Written on the mounting thread (notifyScreenRemoved), drained on the UI
    // thread right before mount items execute (willMountItems).
    private val screensAwaitingSnapshot: MutableSet<Int> = ConcurrentHashMap.newKeySet()

    companion object {
        // we use ConcurrentHashMap here since it will be read on the JS thread,
        // and written to on the UI thread.
        private val viewsMap = ConcurrentHashMap<Int, WeakReference<Screen>>()

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

    // Called from native. Currently this method is called from MountingCoordinator thread,
    // which usually is not UI thread.
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
            // Fabric's mounting transaction removes the screen on a Choreographer frame callback,
            // which can execute before `startRemovalTransition` (scheduled via `Handler.post`).
            // To prevent `Screen.isBeingRemoved` from being read as false during teardown,
            // we must set this flag synchronously here.
            screen.markAsBeingRemoved()

            // The same transaction also deletes the screen's content before the
            // exit animation starts (the differ tears removed subtrees down
            // bottom-up), so the animation would play on an empty screen. Pin
            // the screen's currently presented pixels as an overlay right
            // before that transaction executes - see willMountItems.
            screensAwaitingSnapshot.add(screenTag)

            val isScheduled =
                screen.post {
                    screen.startRemovalTransition()
                }
            if (!isScheduled) {
                Log.w("[RNScreens]", "Failed to schedule removal transition start for screen with tag $screenTag")
            }
        } else {
            Log.w("[RNScreens]", "Reference stored in NativeProxy for tag $screenTag no longer points to valid object.")
        }
    }

    // UIManagerListener. Fabric calls willMountItems on the UI thread right
    // before it executes a round of mount items - the last moment at which a
    // dismissed screen's content is still intact and presented on screen.

    override fun willMountItems(uiManager: UIManager) {
        if (screensAwaitingSnapshot.isEmpty()) {
            return
        }
        val iterator = screensAwaitingSnapshot.iterator()
        while (iterator.hasNext()) {
            val tag = iterator.next()
            iterator.remove()
            viewsMap[tag]?.get()?.let { screen ->
                ScreenDismissSnapshot.pinDismissSnapshot(screen)
                // Also start the removal transition here, synchronously, instead
                // of relying only on the runnable posted in notifyScreenRemoved:
                // this is the last point guaranteed to run before the deleting
                // batch. The view retention it starts cannot fully survive a
                // Reanimated-rebuilt transaction (which is why the snapshot
                // exists), but it keeps the content alive for the first frames
                // when the snapshot bails out (e.g. on a missed deadline).
                screen.startRemovalTransition()
            }
        }
    }

    override fun didMountItems(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit
}
