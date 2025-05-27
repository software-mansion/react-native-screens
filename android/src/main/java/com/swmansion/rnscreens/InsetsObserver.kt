package com.swmansion.rnscreens

import android.view.View
import android.view.WindowInsets
import androidx.core.view.OnApplyWindowInsetsListener
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext

class InsetsObserver(
    context: ReactApplicationContext,
    view: View,
) {
    private val observedView = view
    private var systemListener: View.OnApplyWindowInsetsListener? = null
    private val ownListeners: HashSet<OnApplyWindowInsetsListener> = hashSetOf()

    init {
        context.addLifecycleEventListener(
            object : LifecycleEventListener {
                override fun onHostDestroy() {
                    clear()
                }

                override fun onHostPause() = Unit

                override fun onHostResume() = Unit
            },
        )
    }

    fun onApplyWindowInsets(insets: WindowInsets): WindowInsets {
        var rollingInsets = insets

        systemListener?.onApplyWindowInsets(observedView, insets)?.let {
            rollingInsets = it
        }

        ownListeners.forEach {
            it.onApplyWindowInsets(observedView, WindowInsetsCompat.toWindowInsetsCompat(insets)).toWindowInsets()?.let { windowInsets ->
                rollingInsets = windowInsets
            }
        }

        return rollingInsets
    }

    fun setOnApplyWindowListener(listener: View.OnApplyWindowInsetsListener?) {
        systemListener = listener
    }

    fun addOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        ownListeners.add(listener)
    }

    fun removeOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        ownListeners.remove(listener)
    }

    fun clear() {
        ownListeners.clear()
        systemListener = null
        ViewCompat.setOnApplyWindowInsetsListener(observedView, null)
    }
}
