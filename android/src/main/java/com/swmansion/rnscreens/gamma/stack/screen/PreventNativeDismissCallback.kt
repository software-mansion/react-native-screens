package com.swmansion.rnscreens.gamma.stack.screen

import android.util.Log
import androidx.activity.OnBackPressedCallback
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner

internal class PreventNativeDismissCallback(
    lifecycleOwner: LifecycleOwner,
    private val screen: StackScreen,
    canBeEnabled: Boolean,
) : OnBackPressedCallback(false),
    LifecycleEventObserver,
    PreventNativeDismissChangeObserver {
    /**
     * A kill-switch whether this callback can even be enabled or not. If set to false,
     * no matter other conditions this callback won't be enabled.
     */
    internal var canBeEnabled: Boolean = canBeEnabled
        set(value) {
            field = value
            determineEnabledStatus()
        }

    private val shouldBeEnabled
        get() = canBeEnabled && screen.isPreventNativeDismissEnabled

    init {
        lifecycleOwner.lifecycle.addObserver(this)
    }

    override fun handleOnBackPressed() {
        Log.i("RNScreens", "PreventNativeDismissCallback called for screen ${screen.screenKey}")
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
                determineEnabledStatus()
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
        determineEnabledStatus()
    }

    private fun determineEnabledStatus() {
        this.isEnabled = shouldBeEnabled
    }
}
