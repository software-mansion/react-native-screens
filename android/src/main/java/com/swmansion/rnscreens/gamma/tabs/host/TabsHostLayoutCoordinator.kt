package com.swmansion.rnscreens.gamma.tabs.host

import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import com.facebook.react.modules.core.ReactChoreographer

class TabsHostLayoutCoordinator(private val hostView: TabsHost): ViewTreeObserver.OnPreDrawListener {
    private var hasPostLayoutPending = false
    private var hasChoreographerLayoutPending = false
    private var hasOnPreDrawLayoutPending = false

    init {
        hostView.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(v: View) {
                hostView.viewTreeObserver.addOnPreDrawListener(this@TabsHostLayoutCoordinator)
            }

            override fun onViewDetachedFromWindow(v: View) {
                hostView.viewTreeObserver.removeOnPreDrawListener(this@TabsHostLayoutCoordinator)
            }

        })
    }

    internal fun postLayout() {
        if (hasPostLayoutPending) {
            return
        }
        hasPostLayoutPending = true
        hostView.post {
            hasPostLayoutPending = false
            hostView.forceSubtreeMeasureAndLayoutPass()
        }
    }

    internal fun choreographerLayout() {
        if (hasChoreographerLayoutPending) {
            return
        }
        hasChoreographerLayoutPending = true
        ReactChoreographer.getInstance().postFrameCallback(ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE) {
            hasChoreographerLayoutPending = false
            hostView.forceSubtreeMeasureAndLayoutPass()
        }
    }

    internal fun scheduleOnPreDrawLayout() {
        hasOnPreDrawLayoutPending = true
    }

    override fun onPreDraw(): Boolean {
        if (!hasOnPreDrawLayoutPending) {
            return true
        }

        hasOnPreDrawLayoutPending = false
        hostView.forceSubtreeMeasureAndLayoutPass()

        return true
    }
}