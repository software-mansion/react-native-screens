// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1
package com.swmansion.rnscreens.safearea

import android.annotation.SuppressLint
import android.os.Build
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
import com.facebook.react.views.view.ReactViewGroup
import java.lang.ref.WeakReference

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

        var shouldConsumeDisplayCutout = false
        var consumedInsets =
            WindowInsetsCompat
                .Builder(insets)
                .apply {
                    if (insetType.containsSystem()) {
                        val consumedSystemBarsInsets =
                            getConsumedInsetsFromSelectedEdges(
                                insets.getInsets(
                                    WindowInsetsCompat.Type.systemBars(),
                                ),
                            )

                        val consumedDisplayCutoutInsets =
                            getConsumedInsetsFromSelectedEdges(
                                insets.getInsets(
                                    WindowInsetsCompat.Type.displayCutout(),
                                ),
                            )
                        shouldConsumeDisplayCutout = consumedDisplayCutoutInsets == Insets.NONE

                        setInsets(
                            WindowInsetsCompat.Type.systemBars(),
                            consumedSystemBarsInsets,
                        )
                        setInsets(
                            WindowInsetsCompat.Type.displayCutout(),
                            consumedDisplayCutoutInsets,
                        )
                    }
                }.build()

        // On Android versions prior to R, setInsets(WindowInsetsCompat.Type.displayCutout(), ...)
        // does not work. We need to use previous API.
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R && shouldConsumeDisplayCutout) {
            consumedInsets = consumedInsets.consumeDisplayCutout()
        }

        return consumedInsets
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
        if (stateWrapper != null) {
            val insets = Arguments.createMap()
            insets.putDouble("left", PixelUtil.toDIPFromPixel(safeAreaInsets.left).toDouble())
            insets.putDouble("top", PixelUtil.toDIPFromPixel(safeAreaInsets.top).toDouble())
            insets.putDouble("right", PixelUtil.toDIPFromPixel(safeAreaInsets.right).toDouble())
            insets.putDouble("bottom", PixelUtil.toDIPFromPixel(safeAreaInsets.bottom).toDouble())

            val newState = Arguments.createMap()
            newState.putMap("insets", insets)

            stateWrapper.updateState(newState)
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
