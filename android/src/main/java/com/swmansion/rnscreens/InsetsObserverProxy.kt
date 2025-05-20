package com.swmansion.rnscreens

import android.util.Log
import android.view.View
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import java.lang.ref.WeakReference

object InsetsObserverProxy : OnApplyWindowInsetsListener, LifecycleEventListener {
    private val listeners: HashSet<OnApplyWindowInsetsListener> = hashSetOf()
    private var eventSourceView: WeakReference<View> = WeakReference(null)

    // Please note semantics of this property. This is not `isRegistered`, because somebody, could unregister
    // us, without our knowledge, e.g. reanimated or different 3rd party library. This holds only information
    // whether this observer has been initially registered.
    private var hasBeenRegistered: Boolean = false

    // Mainly debug variable to log warnings in case we missed some code path regarding
    // context lifetime handling.
    private var isObservingContextLifetime: Boolean = false

    private var shouldForwardInsetsToView = true

    // Allow only when we have not been registered yet or the view we're observing has been
    // invalidated due to some lifecycle we have not observed.
    private val allowRegistration get() = !hasBeenRegistered || eventSourceView.get() == null

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
        val observedView = getObservedView()
        if (hasBeenRegistered && observedView != null) {
            ViewCompat.setOnApplyWindowInsetsListener(observedView, null)
            hasBeenRegistered = false
            eventSourceView.clear()
        }
        isObservingContextLifetime = false
    }

    fun addOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        listeners.add(listener)
    }

    fun removeOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        listeners.remove(listener)
    }

    /**
     * @return boolean whether the proxy registered as a listener on a view
     */
    fun registerOnView(view: View): Boolean {
        if (allowRegistration) {
            ViewCompat.setOnApplyWindowInsetsListener(view, this)
            eventSourceView = WeakReference(view)
            hasBeenRegistered = true
            return true
        }
        return false
    }

    fun unregister() {
        getObservedView()?.takeIf { hasBeenRegistered }?.let {
            ViewCompat.setOnApplyWindowInsetsListener(it, null)
        }
    }

    private fun getObservedView(): View? = eventSourceView.get()
}
