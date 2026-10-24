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

    /**
     * Notifies listeners with root window insets, falling back to [insets] when unavailable.
     * Returns [insets] unchanged so observation does not consume them.
     */
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

    /** Subscribes to host lifecycle events so host destruction removes the observer. */
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

    /** Leaves registration to the sheet lifecycle when the host resumes. */
    override fun onHostResume() = Unit

    /** Keeps the observer attached while the host is paused. */
    override fun onHostPause() = Unit

    /** Removes the observer and resets context tracking when the host is destroyed. */
    override fun onHostDestroy() {
        unregister()
        isObservingContextLifetime = false
    }

    /** Adds [listener] once and requests insets from the observer for a new subscription. */
    fun addOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        if (listeners.add(listener)) {
            getObservedView()?.let { ViewCompat.requestApplyInsets(it) }
        }
    }

    /** Stops notifying [listener] without detaching the shared observer. */
    fun removeOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        listeners.remove(listener)
    }

    /**
     * Observes insets through an owned first child, leaving [view]'s listener unchanged.
     * Reuses an observer already attached to [view] and requests current insets.
     *
     * @return true if a new observer was attached, or false if the existing one was reused
     * @throws IllegalStateException if [view] is not a [ViewGroup]
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
                /** Requests insets on attachment, including when the keyboard is already visible. */
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

    /** Removes the owned observer and its listener, retaining subscriptions for later registration. */
    fun unregister() {
        getObservedView()?.let {
            ViewCompat.setOnApplyWindowInsetsListener(it, null)
            (it.parent as? ViewGroup)?.removeView(it)
        }
        eventSourceView.clear()
    }

    /** Returns the owned observer, or null if its weak reference has been cleared. */
    private fun getObservedView(): View? = eventSourceView.get()
}
