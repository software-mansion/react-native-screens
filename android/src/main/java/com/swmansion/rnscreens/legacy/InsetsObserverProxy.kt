package com.swmansion.rnscreens.legacy

import android.util.Log
import android.view.View
import android.view.ViewGroup
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import java.lang.ref.WeakReference

object InsetsObserverProxy : OnApplyWindowInsetsListener, LifecycleEventListener {
    private val listeners: HashSet<OnApplyWindowInsetsListener> = hashSetOf()
    private var eventSourceView: WeakReference<View> = WeakReference(null)

    // Mainly debug variable to log warnings in case we missed some code path regarding
    // context lifetime handling.
    private var isObservingContextLifetime: Boolean = false

    override fun onApplyWindowInsets(
        v: View,
        insets: WindowInsetsCompat,
    ): WindowInsetsCompat {
        // Ancestors can consume system-bar insets before they reach the observer.
        val rootInsets = ViewCompat.getRootWindowInsets(v) ?: insets
        listeners.forEach {
            it.onApplyWindowInsets(v, rootInsets)
        }
        return insets
    }

    // Call this method to ensure that the observer proxy is
    // unregistered when apps is destroyed or we change activity.
    fun registerWithContext(context: ReactApplicationContext) {
        if (isObservingContextLifetime) {
            Log.w(
                "[RNScreens]",
                "InsetObserverProxy registers on new context while it has not been invalidated on the old one. Please report this as issue at https://github.com/software-mansion/react-native-screens/issues",
            )
        }

        isObservingContextLifetime = true
        context.addLifecycleEventListener(this)
    }

    override fun onHostResume() = Unit

    override fun onHostPause() = Unit

    override fun onHostDestroy() {
        unregister()
        isObservingContextLifetime = false
    }

    fun addOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        if (listeners.add(listener)) {
            getObservedView()?.let { ViewCompat.requestApplyInsets(it) }
        }
    }

    fun removeOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        listeners.remove(listener)
    }

    /**
     * @return whether an observer was attached to this view group
     */
    fun registerOnView(view: View): Boolean {
        check(view is ViewGroup) { "[RNScreens] Insets observation requires a view group" }
        getObservedView()?.let {
            if (it.parent === view) {
                ViewCompat.requestApplyInsets(it)
                return false
            }
        }
        unregister()

        // Keep our listener on a view we own; other libraries also observe the decor view.
        val observer =
            object : View(view.context) {
                override fun onAttachedToWindow() {
                    super.onAttachedToWindow()
                    ViewCompat.requestApplyInsets(this)
                }
            }.apply {
                importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
            }
        ViewCompat.setOnApplyWindowInsetsListener(observer, this)
        eventSourceView = WeakReference(observer)
        // On API 29 and lower, a sibling can consume insets for the remaining children.
        view.addView(observer, 0, ViewGroup.LayoutParams(0, 0))
        return true
    }

    fun unregister() {
        getObservedView()?.let {
            ViewCompat.setOnApplyWindowInsetsListener(it, null)
            (it.parent as? ViewGroup)?.removeView(it)
        }
        eventSourceView.clear()
    }

    private fun getObservedView(): View? = eventSourceView.get()
}
