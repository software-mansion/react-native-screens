package com.swmansion.rnscreens.gamma.stack.screen

import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.swmansion.rnscreens.gamma.common.event.ViewAppearanceEventEmitter

internal class StackScreenAppearanceEventsEmitter(
    screenLifecycle: Lifecycle,
    private val appearanceEventEmitter: ViewAppearanceEventEmitter,
) : LifecycleEventObserver {
    init {
        screenLifecycle.addObserver(this)
    }

    override fun onStateChanged(
        source: LifecycleOwner,
        event: Lifecycle.Event,
    ) {
        when (event) {
            Lifecycle.Event.ON_START -> appearanceEventEmitter.emitOnWillAppear()
            Lifecycle.Event.ON_RESUME -> appearanceEventEmitter.emitOnDidAppear()
            Lifecycle.Event.ON_PAUSE -> appearanceEventEmitter.emitOnWillDisappear()
            Lifecycle.Event.ON_STOP -> appearanceEventEmitter.emitOnDidDisappear()
            Lifecycle.Event.ON_DESTROY -> invalidate(source)
            Lifecycle.Event.ON_CREATE, Lifecycle.Event.ON_ANY -> {}
        }
    }

    private fun invalidate(lifecycleOwner: LifecycleOwner) {
        lifecycleOwner.lifecycle.removeObserver(this)
    }
}
