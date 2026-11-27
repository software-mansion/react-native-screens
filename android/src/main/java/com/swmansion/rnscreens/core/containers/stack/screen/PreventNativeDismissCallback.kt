package com.swmansion.rnscreens.core.containers.stack.screen

import androidx.activity.OnBackPressedCallback
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.swmansion.rnscreens.core.utils.RNSLog

internal class PreventNativeDismissCallback(
    lifecycleOwner: LifecycleOwner,
    private val item: StackContainerItem,
    canBeEnabled: Boolean,
    private val interceptor: BackPressInterceptor? = null,
) : OnBackPressedCallback(false),
    LifecycleEventObserver,
    PreventNativeDismissChangeObserver {
    private var started = false
    private val interceptionChanged = Runnable { determineEnabledStatus() }

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
        get() = started && canBeEnabled && (item.isPreventNativeDismissEnabled || interceptor?.isEnabled == true)

    init {
        lifecycleOwner.lifecycle.addObserver(this)
    }

    override fun handleOnBackPressed() {
        if (interceptor?.isEnabled == true) {
            interceptor.dispatch()
            return
        }
        RNSLog.i("RNScreens", "PreventNativeDismissCallback called for screen ${item.itemKey}")
        item.onNativeDismissPrevented()
    }

    override fun onStateChanged(
        source: LifecycleOwner,
        event: Lifecycle.Event,
    ) {
        when (event) {
            Lifecycle.Event.ON_CREATE -> {
                item.preventNativeDismissChangeObserver = this
                interceptor?.addListener(interceptionChanged)
            }

            Lifecycle.Event.ON_START -> {
                started = true
                determineEnabledStatus()
            }

            Lifecycle.Event.ON_STOP -> {
                started = false
                this.isEnabled = false
            }

            Lifecycle.Event.ON_DESTROY -> {
                source.lifecycle.removeObserver(this)
                item.preventNativeDismissChangeObserver = null
                interceptor?.removeListener(interceptionChanged)
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
