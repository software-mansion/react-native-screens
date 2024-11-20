package com.swmansion.rnscreens

import android.view.View
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import java.lang.ref.WeakReference

object InsetsObserverProxy : OnApplyWindowInsetsListener, LifecycleEventListener {
    private val listeners: ArrayList<OnApplyWindowInsetsListener> = arrayListOf()
    private var eventSourceView: WeakReference<View> = WeakReference(null)

    // Please note semantics of this property. This is not `isRegistered`, because somebody, could unregister
    // us, without our knowledge, e.g. reanimated or different 3rd party library. This holds only information
    // whether this observer has been initially registered.
    private var hasBeenRegistered: Boolean = false

    private var shouldForwardInsetsToView = true

    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        var rollingInsets =
            if (shouldForwardInsetsToView) {
                ViewCompat.onApplyWindowInsets(v, insets)
            } else {
                insets
            }

        listeners.forEach {
            rollingInsets = it.onApplyWindowInsets(v, insets)
        }
        return rollingInsets
    }

    // Call this method to ensure that the observer proxy is
    // unregistered when apps is destroyed or we change activity.
    fun registerWithContext(context: ReactApplicationContext) {
        context.addLifecycleEventListener(this)
    }

    override fun onHostResume() = Unit

    override fun onHostPause() = Unit

    override fun onHostDestroy() {
        val observedView = getObservedView()
        if (hasBeenRegistered && observedView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(observedView, null)
            hasBeenRegistered = false
            eventSourceView.clear()
        }
    }

    fun addOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        listeners.add(listener)
    }

    fun removeOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        listeners.remove(listener)
    }

    fun registerOnView(view: View) {
        if (!hasBeenRegistered) {
            ViewCompat.setOnApplyWindowInsetsListener(view, this)
            eventSourceView = WeakReference(view)
            hasBeenRegistered = true
        } else if (getObservedView() != view) {
            throw IllegalStateException(
                "[RNScreens] Attempt to register InsetsObserverProxy on $view while it has been already registered on ${getObservedView()}",
            )
        }
    }

    fun unregister() {
        getObservedView()?.takeIf { hasBeenRegistered }?.let {
            ViewCompat.setOnApplyWindowInsetsListener(it, null)
        }
    }

    private fun getObservedView(): View? = eventSourceView.get()
}
