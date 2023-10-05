package com.swmansion.rnscreens

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerHelper

@ReactModule(name = ScreensModule.REACT_CLASS)
class ScreensModule(private val mReactContext: ReactApplicationContext) : ReactContextBaseJavaModule(
    mReactContext
) {
    override fun getName(): String {
        return REACT_CLASS
    }

    @ReactMethod
    fun startTransition(reactTag: Int) {
        UiThreadUtil.runOnUiThread(
            Runnable {
                val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
                val stack = uiManager?.resolveView(reactTag)
                if (stack is ScreenStack) {
                    stack.attachBelowTop()
                }
            }
        )
    }

    @ReactMethod
    fun updateTransition(reactTag: Int, progress: Double) {
        UiThreadUtil.runOnUiThread(
            Runnable {
                val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
                val stack = uiManager?.resolveView(reactTag)
                if (stack is ScreenStack) {
//                    stack.attachBelowTop()
                }
            }
        )
    }

    @ReactMethod
    fun finishTransition(reactTag: Int, canceled: Boolean) {
        UiThreadUtil.runOnUiThread(
            Runnable {
                val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
                val stack = uiManager?.resolveView(reactTag)
                if (stack is ScreenStack) {
                    stack.detachTop()
                }
            }
        )
    }

    companion object {
        const val REACT_CLASS = "RNSModule"
    }
}
