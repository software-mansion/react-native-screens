package com.swmansion.rnscreens.safearea

import android.annotation.SuppressLint
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
    private var currentInterfaceInsets: EdgeInsets = EdgeInsets.NONE
    private var currentSystemInsets: EdgeInsets = EdgeInsets.NONE
    private var needsInsetsUpdate = false
    private var stateWrapper: StateWrapper? = null

    fun getStateWrapper(): StateWrapper? = stateWrapper

    fun setStateWrapper(stateWrapper: StateWrapper?) {
        this.stateWrapper = stateWrapper
    }

    init {
        ViewCompat.setOnApplyWindowInsetsListener(this, this)
    }

    override fun onAttachedToWindow() {
        viewTreeObserver.addOnPreDrawListener(this)

        val newProvider = findProvider()
        if (newProvider == null) {
            super.onAttachedToWindow()
            return
        }

        newProvider.setOnInterfaceInsetsChangeListener(this)
        provider = WeakReference(newProvider)

        currentInterfaceInsets = newProvider.getInterfaceInsets()
        needsInsetsUpdate = true
        updateInsetsIfNeeded()

        super.onAttachedToWindow()
    }

    override fun onDetachedFromWindow() {
        provider.get()?.removeOnInterfaceInsetsChangeListener(this)

        viewTreeObserver.removeOnPreDrawListener(this)
        super.onDetachedFromWindow()
    }

    private fun findProvider(): SafeAreaProvider? {
        var providerCandidate = this.parent

        while (providerCandidate != null) {
            if (providerCandidate is SafeAreaProvider) {
                break
            }

            providerCandidate = providerCandidate.parent
        }

        return providerCandidate as? SafeAreaProvider
    }

    // TODO: make insets relative to window or don't?
    fun onInterfaceInsetsChange(newInterfaceInsets: EdgeInsets) {
        if (newInterfaceInsets != currentInterfaceInsets) {
            currentInterfaceInsets = newInterfaceInsets
            needsInsetsUpdate = true
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
            needsInsetsUpdate = true
        }

        return WindowInsetsCompat
            .Builder(insets)
            .setInsets(WindowInsetsCompat.Type.systemBars(), Insets.NONE)
            .setInsets(WindowInsetsCompat.Type.displayCutout(), Insets.NONE)
            .build()
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
        // TODO: handle edges
        val safeAreaInsets = EdgeInsets.max(currentInterfaceInsets, currentSystemInsets)
        val stateWrapper = getStateWrapper()
        if (stateWrapper != null) {
            val insets = Arguments.createMap()
            insets.putDouble("top", PixelUtil.toDIPFromPixel(safeAreaInsets.top).toDouble())
            insets.putDouble("right", PixelUtil.toDIPFromPixel(safeAreaInsets.right).toDouble())
            insets.putDouble("bottom", PixelUtil.toDIPFromPixel(safeAreaInsets.bottom).toDouble())
            insets.putDouble("left", PixelUtil.toDIPFromPixel(safeAreaInsets.left).toDouble())

            val newState = Arguments.createMap()
            newState.putMap("insets", insets)

            stateWrapper.updateState(newState)
        } else {
            // TODO: handle Paper
        }
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
