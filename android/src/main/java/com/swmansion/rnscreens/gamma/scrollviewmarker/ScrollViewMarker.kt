package com.swmansion.rnscreens.gamma.scrollviewmarker

import android.annotation.SuppressLint
import android.view.ViewGroup
import android.widget.ScrollView
import androidx.core.view.children
import androidx.core.widget.NestedScrollView
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.views.view.ReactViewGroup

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor") // Should never be inflated / restored
class ScrollViewMarker(
    private val reactContext: ThemedReactContext,
) : ReactViewGroup(reactContext),
    UIManagerListener {
    init {
        // We're adding ourselves during a batch, therefore we expect to receive its finalization callbacks
        val uiManager =
            checkNotNull(UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC)) {
                "[RNScreens] UIManager must not be null."
            }
        uiManager.addUIManagerEventListener(this)
    }

    private var hasAttemptedRegistration: Boolean = false

    /**
     * Currently we discover only ScrollView or NestedScrollView.
     * It'll crash in case scroll view detection fails.
     *
     * Call it only after the children have been already attached and not yet detached.
     */
    private fun findScrollView(): ViewGroup {
        val childScrollView =
            checkNotNull(children.find { childView -> childView is ScrollView || childView is NestedScrollView }) {
                "[RNScreens] Failed to find supported type of ScrollView in children of ScrollViewMarker"
            }

        return childScrollView as ViewGroup
    }

    private fun findSeekingParent(): ScrollViewSeeking? {
        var currentView = parent

        while (currentView != null) {
            if (currentView is ScrollViewSeeking) {
                return currentView
            }
            currentView = currentView.parent
        }

        return null
    }

    private fun registerWithSeekingAncestor() {
        val scrollView = findScrollView()
        findSeekingParent()?.registerScrollView(this, scrollView)
    }

    private fun maybeRegisterWithSeekingAncestor() {
        if (hasAttemptedRegistration) {
            return
        }

        registerWithSeekingAncestor()
        hasAttemptedRegistration = true
    }

    // UIManagerListener

    override fun didMountItems(uiManager: UIManager) {
        maybeRegisterWithSeekingAncestor()
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun willMountItems(uiManager: UIManager) = Unit

    override fun didDispatchMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit
}
