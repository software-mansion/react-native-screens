package com.swmansion.rnscreens.gamma.stack.screen

import android.util.Log
import androidx.activity.OnBackPressedCallback
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner

class PreventNativeDismissCallback(
    lifecycleOwner: LifecycleOwner,
    enabled: Boolean,
    private val screen: StackScreen,
) : OnBackPressedCallback(enabled),
    LifecycleEventObserver,
    PreventNativeDismissChangeObserver {
    init {
        lifecycleOwner.lifecycle.addObserver(this)
    }

    override fun handleOnBackPressed() {
        Log.i("RNScreens", "PreventNativeDismissCallback called")
        screen.onNativeDismissPrevented()
    }

    override fun onStateChanged(
        source: LifecycleOwner,
        event: Lifecycle.Event,
    ) {
        when (event) {
            Lifecycle.Event.ON_CREATE -> {
                screen.preventNativeDismissChangeObserver = this
            }

            Lifecycle.Event.ON_START -> {
                this.isEnabled = screen.isPreventNativeDismissEnabled
            }

            Lifecycle.Event.ON_RESUME -> {
            }

            Lifecycle.Event.ON_PAUSE -> {
            }

            Lifecycle.Event.ON_STOP -> {
                this.isEnabled = false
            }

            Lifecycle.Event.ON_DESTROY -> {
                source.lifecycle.removeObserver(this)
                screen.preventNativeDismissChangeObserver = null
            }

            else -> {
            }
        }
    }

    override fun preventNativeDismissChanged(newValue: Boolean) {
        this.isEnabled = newValue
    }
}
