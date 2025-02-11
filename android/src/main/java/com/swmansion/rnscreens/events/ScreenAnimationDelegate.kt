package com.swmansion.rnscreens.events

import android.animation.Animator
import android.util.Log
import com.swmansion.rnscreens.ScreenStackFragmentWrapper

// The goal is to make this universal delegate for handling animation progress related logic.
// At this moment this class works only with form sheet presentation.
class ScreenAnimationDelegate(
    private val wrapper: ScreenStackFragmentWrapper,
    private val eventEmitter: ScreenEventEmitter?,
    private val animationType: AnimationType,
) : Animator.AnimatorListener {
    enum class AnimationType {
        ENTER,
        EXIT
    }

    private var currentState: LifecycleState = LifecycleState.INITIALIZED

    private fun progressState() {
        currentState =
            when (currentState) {
                LifecycleState.INITIALIZED -> LifecycleState.START_DISPATCHED
                LifecycleState.START_DISPATCHED -> LifecycleState.END_DISPATCHED
                LifecycleState.END_DISPATCHED -> LifecycleState.END_DISPATCHED
            }
    }

    override fun onAnimationStart(animation: Animator) {
        if (currentState === LifecycleState.INITIALIZED) {
            progressState()

            // These callbacks do not work as expected from this call site, TODO: investigate it.
            // To fix it quickly we emit required events manually
//            wrapper.onViewAnimationStart()

            when (animationType) {
                AnimationType.ENTER -> eventEmitter?.dispatchOnWillAppear()
                AnimationType.EXIT -> eventEmitter?.dispatchOnWillDisappear()
            }

            val isExitAnimation = animationType === AnimationType.EXIT
            eventEmitter?.dispatchTransitionProgress(
                0.0f,
                isExitAnimation,
                isExitAnimation,
            )
        }
    }

    override fun onAnimationEnd(animation: Animator) {
        if (currentState === LifecycleState.START_DISPATCHED) {
            progressState()
            animation.removeListener(this)

//            wrapper.onViewAnimationEnd()

            when (animationType) {
                AnimationType.ENTER -> eventEmitter?.dispatchOnAppear()
                AnimationType.EXIT -> eventEmitter?.dispatchOnDisappear()
            }

            val isExitAnimation = animationType === AnimationType.EXIT
            eventEmitter?.dispatchTransitionProgress(
                1.0f,
                isExitAnimation,
                isExitAnimation,
            )

            wrapper.screen.endRemovalTransition()
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
