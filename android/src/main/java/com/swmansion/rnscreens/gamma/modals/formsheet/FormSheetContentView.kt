package com.swmansion.rnscreens.gamma.modals.formsheet

import android.annotation.SuppressLint
import android.content.Context
import android.view.ViewTreeObserver
import com.facebook.react.bridge.UIManager
import com.facebook.react.bridge.UIManagerListener
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup
import com.swmansion.rnscreens.gamma.helpers.getFabricUIManagerNotNull

@OptIn(UnstableReactNativeAPI::class)
@SuppressLint("ViewConstructor")
class FormSheetContentView(
    context: Context,
    private val onSizeChangedCallback: (width: Int, height: Int) -> Unit,
) : ReactViewGroup(context),
    UIManagerListener,
    ViewTreeObserver.OnPreDrawListener {
    private val themedReactContext = context as? ThemedReactContext

    private var isWaitingForFabricMount = false

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        viewTreeObserver.addOnPreDrawListener(this)
        themedReactContext?.let { themedContext ->
            UIManagerHelper
                .getFabricUIManagerNotNull(themedContext)
                .addUIManagerEventListener(this)
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        viewTreeObserver.removeOnPreDrawListener(this)
        themedReactContext?.let { themedContext ->
            UIManagerHelper
                .getFabricUIManagerNotNull(themedContext)
                .removeUIManagerEventListener(this)
        }
    }

    override fun onSizeChanged(
        w: Int,
        h: Int,
        oldw: Int,
        oldh: Int,
    ) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w != oldw || h != oldh) {
            isWaitingForFabricMount = true
            onSizeChangedCallback(w, h)
        }
    }

    override fun onPreDraw(): Boolean {
        // If we're waiting for Fabric to update the recalculated layout for views, we prevent drawing.
        // This cancels the current drawing pass to prevent drawing the screen with stale React children frames.
        return !isWaitingForFabricMount
    }

    override fun didDispatchMountItems(uiManager: UIManager) {
        isWaitingForFabricMount = false
    }

    override fun willDispatchViewUpdates(uiManager: UIManager) = Unit

    override fun willMountItems(uiManager: UIManager) = Unit

    override fun didMountItems(uiManager: UIManager) = Unit

    override fun didScheduleMountItems(uiManager: UIManager) = Unit
}
