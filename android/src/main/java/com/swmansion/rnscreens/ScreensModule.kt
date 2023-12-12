package com.swmansion.rnscreens

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.events.ScreenTransitionProgressEvent
import java.util.concurrent.atomic.AtomicBoolean


@ReactModule(name = ScreensModule.NAME)
class ScreensModule(private val mReactContext: ReactApplicationContext) : NativeScreensModuleSpec (
    mReactContext
) {

    private var topScreenId: Int = -1
    private val isActiveTransition = AtomicBoolean(false)

    init {
        System.loadLibrary("rnscreens")
        val jsContext = reactApplicationContext.javaScriptContextHolder
        if (jsContext != null) {
            nativeInstall(jsContext.get())
        };
    }

    private external fun nativeInstall(jsiPtr: Long)

    override fun getName(): String = NAME

    private fun startTransitionUI(reactTag: Int?): IntArray {
        val result = intArrayOf(-1, -1)
        UiThreadUtil.assertOnUiThread()
        if (isActiveTransition.get() || reactTag == null) {
            return intArrayOf(-1, -1)
        }
        val uiManager = UIManagerHelper.getUIManagerForReactTag(mReactContext, reactTag)
        val stack = uiManager?.resolveView(reactTag)
        if (stack is ScreenStack) {
            val fragments = stack.fragments
            val screensCount = fragments.size
            if (screensCount > 1) {
                isActiveTransition.set(true)
                stack.attachBelowTop()
                topScreenId = fragments[screensCount - 1].screen.id
                result[0] = topScreenId
                result[1] = fragments[screensCount - 2].screen.id
            }
        }
        return result
    }

    private fun updateTransitionUI(progress: Double) {
        if (topScreenId == -1) {
            return
        }
        val progressFloat = progress.toFloat();
        val coalescingKey = (if (progressFloat == 0.0f) 1 else if (progressFloat == 1.0f) 2 else 3).toShort()
        UIManagerHelper
            .getEventDispatcherForReactTag(mReactContext, topScreenId)
            ?.dispatchEvent(
                ScreenTransitionProgressEvent(
                    UIManagerHelper.getSurfaceId(mReactContext),
                    topScreenId, progressFloat, true, true, coalescingKey
                )
            )
    }

    private fun finishTransitionUI(reactTag: Int?, canceled: Boolean) {
        UiThreadUtil.assertOnUiThread()
        if (!isActiveTransition.get() || reactTag == null) {
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
        const val NAME = "RNSModule"
    }
}
