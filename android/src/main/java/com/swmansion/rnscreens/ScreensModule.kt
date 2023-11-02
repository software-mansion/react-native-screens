package com.swmansion.rnscreens

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.common.ScreenTransitionManager
import java.util.concurrent.atomic.AtomicBoolean

@ReactModule(name = ScreensModule.REACT_CLASS)
class ScreensModule(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(
    mReactContext
), ScreenTransitionManager {

    private val isActiveTransition = AtomicBoolean(false)

    override fun getName(): String {
        return REACT_CLASS
    }

    @ReactMethod
    override fun startTransition(reactTag: Int): IntArray {
        return startTransitionUI(reactTag)
    }

    @ReactMethod
    override fun updateTransition(reactTag: Int, progress: Double) {}

    @ReactMethod
    override fun finishTransition(reactTag: Int, canceled: Boolean) {
        finishTransitionUI(reactTag, canceled)
    }

    private fun startTransitionUI(reactTag: Int): IntArray {
        UiThreadUtil.assertOnUiThread()
        if (isActiveTransition.get()) {
            return intArrayOf(-1, -1)
        }
        val screenTags: IntArray = intArrayOf(-1, -1)
        val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
        val stack = uiManager?.resolveView(reactTag)
        if (stack is ScreenStack) {
            val fragments = stack.fragments
            val screensCount = fragments.size
            if (screensCount > 1) {
                isActiveTransition.set(true)
                stack.attachBelowTop()
                screenTags[0] = fragments[screensCount - 1].screen.id
                screenTags[1] = fragments[screensCount - 2].screen.id
            }
        }
        return screenTags
    }

    private fun finishTransitionUI(reactTag: Int, canceled: Boolean) {
        UiThreadUtil.assertOnUiThread()
        if (!isActiveTransition.get()) {
            return
        }
        val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
        val stack = uiManager?.resolveView(reactTag)
        if (stack is ScreenStack) {
            if (canceled) {
                stack.detachBelowTop()
            } else {
                stack.detachTop()
            }
            isActiveTransition.set(false)
        }
    }

    companion object {
        const val REACT_CLASS = "RNSModule"
    }
}
