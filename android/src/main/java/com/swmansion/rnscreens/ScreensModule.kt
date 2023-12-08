package com.swmansion.rnscreens

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.common.ScreenTransitionManager
import java.util.concurrent.atomic.AtomicBoolean


@ReactModule(name = ScreensModule.NAME)
class ScreensModule(private val mReactContext: ReactApplicationContext) : NativeScreensModuleSpec (
    mReactContext
), ScreenTransitionManager {

    init {
        System.loadLibrary("rnscreens")
        val jsContext = reactApplicationContext.javaScriptContextHolder
        if (jsContext != null) {
            nativeInstall(jsContext.get())
        };
    }

    private external fun nativeInstall(jsiPtr: Long)

    private val isActiveTransition = AtomicBoolean(false)

    override fun getName(): String = NAME

    @ReactMethod
    override fun startTransition(reactTag: Double?): WritableArray
        = startTransitionUI(reactTag?.toInt())

    @ReactMethod
    override fun updateTransition(reactTag: Double?, progress: Double): Boolean {
        return false
    }

    @ReactMethod
    override fun finishTransition(reactTag: Double?, canceled: Boolean): Boolean
        = finishTransitionUI(reactTag?.toInt(), canceled)

    private fun startTransitionUI(reactTag: Int?): WritableArray {
        val result = Arguments.createArray()
        UiThreadUtil.assertOnUiThread()
        if (isActiveTransition.get() || reactTag == null) {
            result.pushInt(-1)
            result.pushInt(-1)
            return result
        }
        val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
        val stack = uiManager?.resolveView(reactTag)
        if (stack is ScreenStack) {
            val fragments = stack.fragments
            val screensCount = fragments.size
            if (screensCount > 1) {
                isActiveTransition.set(true)
                stack.attachBelowTop()
                result.pushInt(fragments[screensCount - 1].screen.id)
                result.pushInt(fragments[screensCount - 2].screen.id)
            }
        }
        return result
    }

    private fun finishTransitionUI(reactTag: Int?, canceled: Boolean): Boolean {
        UiThreadUtil.assertOnUiThread()
        if (!isActiveTransition.get() || reactTag == null) {
            return false
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
        return true
    }

    companion object {
        const val NAME = "RNSModule"
    }
}
