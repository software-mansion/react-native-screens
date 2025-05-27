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
    private val observedView: View,
) {
    /**
     * Listener set from outside of this package.
     */
    private var externalListener: View.OnApplyWindowInsetsListener? = null
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
        var currentInsets = insets

        externalListener?.onApplyWindowInsets(observedView, insets)?.let {
            currentInsets = it
        }

        ownListeners.forEach {
            val insetsCompat = WindowInsetsCompat.toWindowInsetsCompat(insets)
            currentInsets =
                checkNotNull(it.onApplyWindowInsets(observedView, insetsCompat).toWindowInsets()) {
                    "[RNScreens] Window insets conversion should never fail above API level 20"
                }
        }

        // These are insets of last registered observer!
        return currentInsets
    }

    fun setExternalOnApplyWindowInsetsListener(listener: View.OnApplyWindowInsetsListener?) {
        externalListener = listener
    }

    fun addOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        ownListeners.add(listener)
    }

    fun removeOnApplyWindowInsetsListener(listener: OnApplyWindowInsetsListener) {
        ownListeners.remove(listener)
    }

    fun clear() {
        ownListeners.clear()
        externalListener = null
        ViewCompat.setOnApplyWindowInsetsListener(observedView, null)
    }
}
