package com.fabricexample.nestedscroll

import android.view.View
import android.view.ViewParent
import androidx.core.view.ViewCompat
import androidx.core.view.ViewParentCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.common.nestedscroll.ScreenNestedScrollInterop

class NestedScrollInteropTestModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
    private data class ParentTransaction(
        val parent: ViewParent,
        val type: Int,
    )

    override fun getName(): String = NAME

    @ReactMethod
    fun configure(
        enabled: Boolean,
        consumeRemaining: Boolean,
        promise: Promise,
    ) {
        NestedScrollInteropTestProbe.configure(enabled, consumeRemaining)
        promise.resolve(null)
    }

    @ReactMethod
    fun setFactoryInstalled(
        installed: Boolean,
        promise: Promise,
    ) {
        if (installed) {
            NestedScrollInteropTestProbe.install()
        } else {
            ScreenNestedScrollInterop.removeFactory(NestedScrollInteropTestProbe)
        }
        promise.resolve(null)
    }

    @ReactMethod
    fun dispatchInterleavedLifecycle(
        reactTag: Double,
        promise: Promise,
    ) {
        reactApplicationContext.runOnUiQueueThread {
            val tag = reactTag.toInt()
            val target =
                try {
                    UIManagerHelper
                        .getUIManagerForReactTag(reactApplicationContext, tag)
                        ?.resolveView(tag)
                } catch (_: Throwable) {
                    null
                }

            if (target == null) {
                promise.reject(
                    "E_NESTED_SCROLL_TARGET",
                    "Could not resolve nested-scroll target for reactTag=$reactTag",
                )
                return@runOnUiQueueThread
            }

            var touchTransaction: ParentTransaction? = null
            var nonTouchTransaction: ParentTransaction? = null
            try {
                touchTransaction =
                    checkNotNull(startParentTransaction(target, ViewCompat.TYPE_TOUCH)) {
                        "Initial TYPE_TOUCH transaction was not accepted"
                    }
                stopParentTransaction(target, touchTransaction)
                touchTransaction = null

                nonTouchTransaction =
                    checkNotNull(startParentTransaction(target, ViewCompat.TYPE_NON_TOUCH)) {
                        "TYPE_NON_TOUCH transaction was not accepted by the parent chain"
                    }

                // Keep NON_TOUCH open while a second TOUCH transaction starts. This exercises
                // the production coordinator's per-type state without depending on whether the
                // stock ReactScrollView itself implements NestedScrollingChild2/3.
                touchTransaction =
                    checkNotNull(startParentTransaction(target, ViewCompat.TYPE_TOUCH)) {
                        "Second TYPE_TOUCH transaction was not accepted"
                    }

                stopParentTransaction(target, touchTransaction)
                touchTransaction = null
                stopParentTransaction(target, nonTouchTransaction)
                nonTouchTransaction = null

                promise.resolve(null)
            } catch (error: Throwable) {
                touchTransaction?.let { stopParentTransaction(target, it) }
                nonTouchTransaction?.let { stopParentTransaction(target, it) }
                promise.reject("E_NESTED_SCROLL_LIFECYCLE", error)
            }
        }
    }

    @ReactMethod
    fun reset(promise: Promise) {
        NestedScrollInteropTestProbe.reset()
        promise.resolve(null)
    }

    @ReactMethod
    fun snapshot(promise: Promise) {
        val snapshot = NestedScrollInteropTestProbe.snapshot()
        val lifecycleTrace = Arguments.createArray().apply {
            snapshot.lifecycleTrace.forEach(::pushString)
        }
        val map = Arguments.createMap().apply {
            putDouble("sequence", snapshot.sequence.toDouble())
            putInt("delegatesCreated", snapshot.delegatesCreated)
            putInt("attached", snapshot.attached)
            putInt("detached", snapshot.detached)
            putInt("layouts", snapshot.layouts)
            putInt("touchStarts", snapshot.touchStarts)
            putInt("nonTouchStarts", snapshot.nonTouchStarts)
            putInt("touchStops", snapshot.touchStops)
            putInt("nonTouchStops", snapshot.nonTouchStops)
            putInt("touchPre", snapshot.touchPre)
            putInt("nonTouchPre", snapshot.nonTouchPre)
            putInt("touchPost", snapshot.touchPost)
            putInt("nonTouchPost", snapshot.nonTouchPost)
            putInt("preFlings", snapshot.preFlings)
            putInt("flings", snapshot.flings)
            putDouble("delegateConsumedPreY", snapshot.delegateConsumedPreY.toDouble())
            putDouble("delegateConsumedPostY", snapshot.delegateConsumedPostY.toDouble())
            putString("lastScreenClass", snapshot.lastScreenClass)
            putInt("lastScreenId", snapshot.lastScreenId)
            putString("lastTargetClass", snapshot.lastTargetClass)
            putInt("lastTargetId", snapshot.lastTargetId)
            putInt("lastTargetScrollY", snapshot.lastTargetScrollY)
            putArray("lifecycleTrace", lifecycleTrace)
        }
        promise.resolve(map)
    }

    private fun startParentTransaction(
        target: View,
        type: Int,
    ): ParentTransaction? {
        var child = target
        var parent = target.parent

        while (parent != null) {
            if (
                ViewParentCompat.onStartNestedScroll(
                    parent,
                    child,
                    target,
                    ViewCompat.SCROLL_AXIS_VERTICAL,
                    type,
                )
            ) {
                ViewParentCompat.onNestedScrollAccepted(
                    parent,
                    child,
                    target,
                    ViewCompat.SCROLL_AXIS_VERTICAL,
                    type,
                )
                return ParentTransaction(parent, type)
            }

            if (parent !is View) {
                return null
            }
            child = parent
            parent = parent.parent
        }

        return null
    }

    private fun stopParentTransaction(
        target: View,
        transaction: ParentTransaction,
    ) {
        ViewParentCompat.onStopNestedScroll(
            transaction.parent,
            target,
            transaction.type,
        )
    }

    companion object {
        const val NAME = "NestedScrollInteropTest"
    }
}
