package com.swmansion.rnscreens

import android.util.Log
import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.fabric.FabricUIManager
import java.lang.ref.WeakReference
import java.util.concurrent.ConcurrentHashMap

class NativeProxy {
    @DoNotStrip
    @Suppress("unused")
    private val mHybridData: HybridData

    init {
        mHybridData = initHybrid()
    }

    private external fun initHybrid(): HybridData

    external fun nativeAddMutationsListener(fabricUIManager: FabricUIManager)

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

    // Called from native
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
            screen.startRemovalTransition()
        } else {
            Log.w("[RNScreens]", "Reference stored in NativeProxy for tag $screenTag no longer points to valid object.")
        }
    }
}
