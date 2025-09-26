// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea

import android.annotation.SuppressLint
import android.util.Log
import android.view.View
import android.view.ViewTreeObserver
import androidx.core.graphics.Insets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.StateWrapper
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper.getReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.BuildConfig
import com.swmansion.rnscreens.safearea.paper.SafeAreaViewEdges
import com.swmansion.rnscreens.safearea.paper.SafeAreaViewLocalData
import java.lang.ref.WeakReference
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

private const val MAX_WAIT_TIME_NANO = 500000000L // 500ms

@SuppressLint("ViewConstructor") // Should never be recreated
class SafeAreaView(
    private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext),
    OnApplyWindowInsetsListener,
    ViewTreeObserver.OnPreDrawListener {
    private var provider = WeakReference<SafeAreaProvider>(null)
    private var currentInterfaceInsets: EdgeInsets = EdgeInsets.ZERO
    private var currentSystemInsets: EdgeInsets = EdgeInsets.ZERO
    private var needsInsetsUpdate = false
    private var stateWrapper: StateWrapper? = null
    private var edges: SafeAreaViewEdges? = null
    private var insetType: InsetType = InsetType.ALL

    fun getStateWrapper(): StateWrapper? = stateWrapper

    fun setStateWrapper(stateWrapper: StateWrapper?) {
        this.stateWrapper = stateWrapper
    }

    init {
        ViewCompat.setOnApplyWindowInsetsListener(this, this)
    }

    override fun onAttachedToWindow() {
        viewTreeObserver.addOnPreDrawListener(this)

        val newProvider = findAncestorProvider()
        if (newProvider == null) {
            super.onAttachedToWindow()
            return
        }

        newProvider.setOnInterfaceInsetsChangeListener(this)
        provider = WeakReference(newProvider)

        currentInterfaceInsets = newProvider.getInterfaceInsets()
        updateInsets()

        super.onAttachedToWindow()
    }

    override fun onDetachedFromWindow() {
        provider.get()?.removeOnInterfaceInsetsChangeListener(this)

        viewTreeObserver.removeOnPreDrawListener(this)
        super.onDetachedFromWindow()
    }

    private fun findAncestorProvider(): SafeAreaProvider? {
        var providerCandidate = this.parent

        while (providerCandidate != null) {
            if (providerCandidate is SafeAreaProvider) {
                break
            }

            providerCandidate = providerCandidate.parent
        }

        return providerCandidate as? SafeAreaProvider
    }

    fun onInterfaceInsetsChange(newInterfaceInsets: EdgeInsets) {
        if (newInterfaceInsets != currentInterfaceInsets) {
            currentInterfaceInsets = newInterfaceInsets

            if (insetType.containsInterface()) {
                needsInsetsUpdate = true
            }
        }
    }

    override fun onApplyWindowInsets(
        view: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        val newSystemInsets =
            insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())

        if (newSystemInsets != currentSystemInsets) {
            currentSystemInsets = EdgeInsets.fromInsets(newSystemInsets)

            if (insetType.containsSystem()) {
                needsInsetsUpdate = true
            }
        }

        return WindowInsetsCompat
            .Builder(insets)
            .apply {
                if (insetType.containsSystem()) {
                    setInsets(
                        WindowInsetsCompat.Type.systemBars(),
                        getConsumedInsetsFromSelectedEdges(
                            insets.getInsets(
                                WindowInsetsCompat.Type.systemBars(),
                            ),
                        ),
                    )
                    setInsets(
                        WindowInsetsCompat.Type.displayCutout(),
                        getConsumedInsetsFromSelectedEdges(
                            insets.getInsets(
                                WindowInsetsCompat.Type.displayCutout(),
                            ),
                        ),
                    )
                }
            }.build()
    }

    private fun updateInsetsIfNeeded(): Boolean {
        if (needsInsetsUpdate) {
            needsInsetsUpdate = false
            updateInsets()
            return true
        }
        return false
    }

    private fun updateInsets() {
        val safeAreaInsets =
            EdgeInsets.max(
                if (insetType.containsInterface()) currentInterfaceInsets else EdgeInsets.ZERO,
                if (insetType.containsSystem()) currentSystemInsets else EdgeInsets.ZERO,
            )

        val stateWrapper = getStateWrapper()
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED && stateWrapper != null) {
            val insets = Arguments.createMap()
            insets.putDouble("left", PixelUtil.toDIPFromPixel(safeAreaInsets.left).toDouble())
            insets.putDouble("top", PixelUtil.toDIPFromPixel(safeAreaInsets.top).toDouble())
            insets.putDouble("right", PixelUtil.toDIPFromPixel(safeAreaInsets.right).toDouble())
            insets.putDouble("bottom", PixelUtil.toDIPFromPixel(safeAreaInsets.bottom).toDouble())

            val newState = Arguments.createMap()
            newState.putMap("insets", insets)

            stateWrapper.updateState(newState)
        } else if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            val localData =
                SafeAreaViewLocalData(
                    insets = safeAreaInsets,
                    edges = edges ?: SafeAreaViewEdges.ZERO,
                )
            val reactContext = getReactContext(this)
            val uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
            if (uiManager != null) {
                uiManager.setViewLocalData(id, localData)
                // Sadly there doesn't seem to be a way to properly dirty a yoga node from java, so
                // if we are in the middle of a layout, we need to recompute it. There is also no
                // way to know whether we are in the middle of a layout so always do it.
                reactContext.runOnNativeModulesQueueThread {
                    uiManager.uiImplementation.dispatchViewUpdates(-1)
                }
                waitForReactLayout()
            }
        }
    }

    private fun waitForReactLayout() {
        // Block the main thread until the native module thread is finished with
        // its current tasks. To do this we use the done boolean as a lock and enqueue
        // a task on the native modules thread. When the task runs we can unblock the
        // main thread. This should be safe as long as the native modules thread
        // does not block waiting on the main thread.
        var done = false
        val lock = ReentrantLock()
        val condition = lock.newCondition()
        val startTime = System.nanoTime()
        var waitTime = 0L
        getReactContext(this).runOnNativeModulesQueueThread {
            lock.withLock {
                if (!done) {
                    done = true
                    condition.signal()
                }
            }
        }
        lock.withLock {
            while (!done && waitTime < MAX_WAIT_TIME_NANO) {
                try {
                    condition.awaitNanos(MAX_WAIT_TIME_NANO)
                } catch (ex: InterruptedException) {
                    // In case of an interrupt just give up waiting.
                    done = true
                }
                waitTime += System.nanoTime() - startTime
            }
        }
        // Timed out waiting.
        if (waitTime >= MAX_WAIT_TIME_NANO) {
            Log.w(TAG, "Timed out waiting for layout.")
        }
    }

    private fun getConsumedInsetsFromSelectedEdges(insets: Insets): Insets =
        Insets.of(
            if (edges?.left ?: false) 0 else insets.left,
            if (edges?.top ?: false) 0 else insets.top,
            if (edges?.right ?: false) 0 else insets.right,
            if (edges?.bottom ?: false) 0 else insets.bottom,
        )

    fun setEdges(edges: SafeAreaViewEdges) {
        this.edges = edges
        requestApplyInsets()

        // We don't want to call updateInsetsIfNeeded here because system insets don't arrive
        // immediately after requestApplyInsets. We just set the flag to true to make sure the
        // update is eventually executed.
        needsInsetsUpdate = true
    }

    fun setInsetType(insetType: InsetType) {
        this.insetType = insetType
        requestApplyInsets()

        // We don't want to call updateInsetsIfNeeded here because system insets don't arrive
        // immediately after requestApplyInsets. We just set the flag to true to make sure the
        // update is eventually executed, even if we set insetType to `INTERFACE`.
        needsInsetsUpdate = true
    }

    override fun onPreDraw(): Boolean {
        val didUpdate = updateInsetsIfNeeded()
        if (didUpdate) {
            requestLayout()
        }
        return !didUpdate
    }

    companion object {
        const val TAG = "SafeAreaView"
    }
}
