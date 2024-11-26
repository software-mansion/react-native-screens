package com.swmansion.rnscreens.events

import android.util.Log
import androidx.transition.Transition
import com.swmansion.rnscreens.ScreenEventDispatcher
import com.swmansion.rnscreens.ScreenFragment
import com.swmansion.rnscreens.ScreenFragmentWrapper

class ScreenEventDelegate(private val eventDispatcher: ScreenEventDispatcher, private val wrapper: ScreenFragmentWrapper, private val direction: TransitionDirection): Transition.TransitionListener {
    private var currentState: LifecycleState = LifecycleState.INITIALIZED

    override fun onTransitionStart(transition: Transition) {
        if (currentState < LifecycleState.START_DISPATCHED) {
            Log.i(TAG, "onTransitionStart")
            val eventType = if (direction === TransitionDirection.FORWARD) {
                ScreenFragment.ScreenLifecycleEvent.WILL_APPEAR
            } else {
                ScreenFragment.ScreenLifecycleEvent.WILL_DISAPPEAR
            }
            eventDispatcher.dispatchLifecycleEvent(eventType, wrapper)
            progressState()
        }
    }

    override fun onTransitionEnd(transition: Transition) {
        if (currentState < LifecycleState.END_DISPATCHED) {
            Log.i(TAG, "onTransitionEnd")
            val eventType = if (direction === TransitionDirection.FORWARD) {
                ScreenFragment.ScreenLifecycleEvent.DID_APPEAR
            } else {
                ScreenFragment.ScreenLifecycleEvent.DID_DISAPPEAR
            }
            eventDispatcher.dispatchLifecycleEvent(eventType, wrapper)
            transition.removeListener(this)
            progressState()
        }
    }

    override fun onTransitionCancel(transition: Transition) = Unit

    override fun onTransitionPause(transition: Transition) = Unit

    override fun onTransitionResume(transition: Transition) = Unit

    private fun progressState() {
       currentState = when (currentState) {
           LifecycleState.INITIALIZED -> LifecycleState.START_DISPATCHED
           LifecycleState.START_DISPATCHED -> LifecycleState.END_DISPATCHED
           LifecycleState.END_DISPATCHED -> LifecycleState.END_DISPATCHED
       }
    }

    private fun resetState() {
       currentState = LifecycleState.INITIALIZED
    }

    private enum class LifecycleState {
        INITIALIZED,
        START_DISPATCHED,
        END_DISPATCHED,
    }

    enum class TransitionDirection {
        FORWARD,
        BACKWARD,
    }

    companion object {
        const val TAG = "ScreenEventDelegate"
    }
}