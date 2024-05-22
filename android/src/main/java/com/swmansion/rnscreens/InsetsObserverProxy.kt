package com.swmansion.rnscreens

import android.view.View
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.lang.ref.WeakReference

object InsetsObserverProxy : OnApplyWindowInsetsListener {
    private val listeners: ArrayList<OnApplyWindowInsetsListener> = arrayListOf()
    private var eventSourceView: WeakReference<View> = WeakReference(null)

    // Please note semantics of this property. This is not `isRegistered`, because somebody, could unregister
    // us, without our knowledge, e.g. reanimated or different 3rd party library. This holds only information
    // whether this observer has been initially registered.
    private var hasBeenRegistered: Boolean = false

    override fun onApplyWindowInsets(v: View, insets: WindowInsetsCompat): WindowInsetsCompat {
        var rollingInsets = insets
        listeners.forEach {
            rollingInsets = it.onApplyWindowInsets(v, insets)
        }
        return rollingInsets
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
        }
    }

    fun unregister() {
        eventSourceView.get()?.takeIf { hasBeenRegistered }?.let {
            ViewCompat.setOnApplyWindowInsetsListener(it, null)
        }
    }
}
