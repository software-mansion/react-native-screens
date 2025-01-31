package com.swmansion.rnscreens.events

import android.animation.Animator
import com.swmansion.rnscreens.ScreenFragmentWrapper

class ScreenEventDelegate(private val wrapper: ScreenFragmentWrapper) : Animator.AnimatorListener {
    private var currentState: LifecycleState = LifecycleState.INITIALIZED

    private fun progressState() {
       currentState = when (currentState) {
           LifecycleState.INITIALIZED -> LifecycleState.START_DISPATCHED
           LifecycleState.START_DISPATCHED -> LifecycleState.END_DISPATCHED
           LifecycleState.END_DISPATCHED -> LifecycleState.END_DISPATCHED
       }
    }

    override fun onAnimationStart(animation: Animator) {
        if (currentState === LifecycleState.INITIALIZED) {
            progressState()
            wrapper.onViewAnimationStart()
        }
    }

    override fun onAnimationEnd(animation: Animator) {
        if (currentState === LifecycleState.START_DISPATCHED) {
            progressState()
            animation.removeListener(this)
            wrapper.onViewAnimationEnd()
        }
    }

    override fun onAnimationCancel(animation: Animator) = Unit

    override fun onAnimationRepeat(animation: Animator) = Unit

    private enum class LifecycleState {
        INITIALIZED,
        START_DISPATCHED,
        END_DISPATCHED,
    }

    companion object {
        const val TAG = "ScreenEventDelegate"
    }
}