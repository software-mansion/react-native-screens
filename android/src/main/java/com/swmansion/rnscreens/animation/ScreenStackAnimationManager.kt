package com.swmansion.rnscreens.animation

import android.animation.Animator
import android.animation.AnimatorInflater
import android.animation.AnimatorSet
import android.animation.ValueAnimator
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import com.swmansion.rnscreens.R
import com.swmansion.rnscreens.Screen
import com.swmansion.rnscreens.ScreenStackFragment
import com.swmansion.rnscreens.ScreenStackFragmentWrapper
import com.swmansion.rnscreens.bottomsheet.usesFormSheetPresentation
import com.swmansion.rnscreens.events.ScreenAnimationDelegate
import com.swmansion.rnscreens.events.ScreenEventEmitter
import com.swmansion.rnscreens.transition.ExternalBoundaryValuesEvaluator

class ScreenStackAnimationManager {
    private var stackAnimation: Screen.StackAnimation = Screen.StackAnimation.NONE
    private var shouldUseOpenAnimation: Boolean = true
    private val propertyAnimationFragments: MutableSet<ScreenStackFragment> = mutableSetOf()

    fun reset() {
        stackAnimation = Screen.StackAnimation.NONE
        shouldUseOpenAnimation = true
        propertyAnimationFragments.clear()
    }

    fun configure(stackAnimation: Screen.StackAnimation, shouldUseOpenAnimation: Boolean) {
        this.stackAnimation = stackAnimation
        this.shouldUseOpenAnimation = shouldUseOpenAnimation
    }

    fun updatePropertyAnimationFragmentsFromStack(stack: List<ScreenStackFragmentWrapper>) {
        var begin = false
        for ((index, screenWrapper) in stack.reversed().withIndex()) {
            if (screenWrapper is ScreenStackFragment) {
                // TODO(animations): should we use isTranslucent or detect formSheet only?
                if (begin) {
                    if (screenWrapper.isTranslucent()) {
                        propertyAnimationFragments.add(screenWrapper)
                    } else {
                        propertyAnimationFragments.add(screenWrapper)
                        begin = false
                    }
                }

                if ((!screenWrapper.isTranslucent() && index + 1 < stack.size && stack.reversed()[index + 1].isTranslucent()) ||
                    screenWrapper.isTranslucent()
                ) {
                    propertyAnimationFragments.add(screenWrapper)
                    begin = true
                }
            }
        }
    }

    fun getAnimationForFragment(fragment: ScreenStackFragment, enter: Boolean): Animation? {
        // TODO(animations): refactor, verify correct animations

        // TODO(animations): dont detect formSheet here but depend on propertyAnimationFragments?
        if (propertyAnimationFragments.contains(fragment)) {
            return null
        }

        // TODO(animations): remove log
        println("${fragment} uses tween animation")

        val enterAnimation: Int
        val exitAnimation: Int

        if (shouldUseOpenAnimation) {
            when (stackAnimation) {
                Screen.StackAnimation.DEFAULT -> {
                    enterAnimation = R.anim.rns_default_enter_in
                    exitAnimation = R.anim.rns_default_enter_out
                }
                Screen.StackAnimation.NONE -> {
                    enterAnimation = R.anim.rns_no_animation_20
                    exitAnimation = R.anim.rns_no_animation_20
                }
                Screen.StackAnimation.FADE -> {
                    enterAnimation = R.anim.rns_fade_in
                    exitAnimation = R.anim.rns_fade_out
                }
                Screen.StackAnimation.SLIDE_FROM_RIGHT -> {
                    enterAnimation = R.anim.rns_slide_in_from_right
                    exitAnimation = R.anim.rns_slide_out_to_left
                }
                Screen.StackAnimation.SLIDE_FROM_LEFT -> {
                    enterAnimation = R.anim.rns_slide_in_from_left
                    exitAnimation = R.anim.rns_slide_out_to_right
                }
                Screen.StackAnimation.SLIDE_FROM_BOTTOM -> {
                    enterAnimation = R.anim.rns_slide_in_from_bottom
                    exitAnimation = R.anim.rns_no_animation_medium
                }
                Screen.StackAnimation.FADE_FROM_BOTTOM -> {
                    enterAnimation = R.anim.rns_fade_from_bottom
                    exitAnimation = R.anim.rns_no_animation_350
                }
                Screen.StackAnimation.IOS_FROM_RIGHT -> {
                    enterAnimation = R.anim.rns_ios_from_right_foreground_open
                    exitAnimation = R.anim.rns_ios_from_right_background_open
                }
                Screen.StackAnimation.IOS_FROM_LEFT -> {
                    enterAnimation = R.anim.rns_ios_from_left_foreground_open
                    exitAnimation = R.anim.rns_ios_from_left_background_open
                }
            }
        } else {
            when (stackAnimation) {
                Screen.StackAnimation.DEFAULT -> {
                    enterAnimation = R.anim.rns_default_exit_in
                    exitAnimation = R.anim.rns_default_exit_out
                }
                Screen.StackAnimation.NONE -> {
                    enterAnimation = R.anim.rns_no_animation_20
                    exitAnimation = R.anim.rns_no_animation_20
                }
                Screen.StackAnimation.FADE -> {
                    enterAnimation = R.anim.rns_fade_in
                    exitAnimation = R.anim.rns_fade_out
                }
                Screen.StackAnimation.SLIDE_FROM_RIGHT -> {
                    enterAnimation = R.anim.rns_slide_in_from_left
                    exitAnimation = R.anim.rns_slide_out_to_right
                }
                Screen.StackAnimation.SLIDE_FROM_LEFT -> {
                    enterAnimation = R.anim.rns_slide_in_from_right
                    exitAnimation = R.anim.rns_slide_out_to_left
                }
                Screen.StackAnimation.SLIDE_FROM_BOTTOM -> {
                    enterAnimation = R.anim.rns_no_animation_medium
                    exitAnimation = R.anim.rns_slide_out_to_bottom
                }
                Screen.StackAnimation.FADE_FROM_BOTTOM -> {
                    enterAnimation = R.anim.rns_no_animation_250
                    exitAnimation = R.anim.rns_fade_to_bottom
                }
                Screen.StackAnimation.IOS_FROM_RIGHT -> {
                    enterAnimation = R.anim.rns_ios_from_right_background_close
                    exitAnimation = R.anim.rns_ios_from_right_foreground_close
                }
                Screen.StackAnimation.IOS_FROM_LEFT -> {
                    enterAnimation = R.anim.rns_ios_from_left_background_close
                    exitAnimation = R.anim.rns_ios_from_left_foreground_close
                }
            }
        }

        return AnimationUtils.loadAnimation(
            fragment.context,
            if (enter) enterAnimation else exitAnimation
        )
    }

    fun getAnimatorForFragment(fragment: ScreenStackFragment, enter: Boolean): Animator? {
        // TODO(animations): refactor!!, verify correct animators

        // TODO(animations): remove false from condition
        if (!propertyAnimationFragments.contains(fragment)) {
            return null
        }

        // TODO(animations): remove log
        println("${fragment} uses animator")

        var animatorSet: AnimatorSet = AnimatorSet()

        if (!fragment.screen.usesFormSheetPresentation()) {
            val enterAnimation: Int
            val exitAnimation: Int

            if (shouldUseOpenAnimation) {
                when (stackAnimation) {
                    Screen.StackAnimation.DEFAULT -> {
                        enterAnimation = R.animator.rns_default_enter_in
                        exitAnimation = R.animator.rns_default_enter_out
                    }
                    Screen.StackAnimation.NONE -> {
                        enterAnimation = R.animator.rns_no_animation_20
                        exitAnimation = R.animator.rns_no_animation_20
                    }
                    Screen.StackAnimation.FADE -> {
                        enterAnimation = R.animator.rns_fade_in
                        exitAnimation = R.animator.rns_fade_out
                    }
                    Screen.StackAnimation.SLIDE_FROM_RIGHT -> {
                        enterAnimation = R.animator.rns_slide_in_from_right
                        exitAnimation = R.animator.rns_slide_out_to_left
                    }
                    Screen.StackAnimation.SLIDE_FROM_LEFT -> {
                        enterAnimation = R.animator.rns_slide_in_from_left
                        exitAnimation = R.animator.rns_slide_out_to_right
                    }
                    Screen.StackAnimation.SLIDE_FROM_BOTTOM -> {
                        enterAnimation = R.animator.rns_slide_in_from_bottom
                        exitAnimation = R.animator.rns_no_animation_medium
                    }
                    Screen.StackAnimation.FADE_FROM_BOTTOM -> {
                        enterAnimation = R.animator.rns_fade_from_bottom
                        exitAnimation = R.animator.rns_no_animation_350
                    }
                    Screen.StackAnimation.IOS_FROM_RIGHT -> {
                        enterAnimation = R.animator.rns_ios_from_right_foreground_open
                        exitAnimation = R.animator.rns_ios_from_right_background_open
                    }
                    Screen.StackAnimation.IOS_FROM_LEFT -> {
                        enterAnimation = R.animator.rns_ios_from_left_foreground_open
                        exitAnimation = R.animator.rns_ios_from_left_background_open
                    }
                }
            } else {
                when (stackAnimation) {
                    Screen.StackAnimation.DEFAULT -> {
                        enterAnimation = R.animator.rns_default_exit_in
                        exitAnimation = R.animator.rns_default_exit_out
                    }
                    Screen.StackAnimation.NONE -> {
                        enterAnimation = R.animator.rns_no_animation_20
                        exitAnimation = R.animator.rns_no_animation_20
                    }
                    Screen.StackAnimation.FADE -> {
                        enterAnimation = R.animator.rns_fade_in
                        exitAnimation = R.animator.rns_fade_out
                    }
                    Screen.StackAnimation.SLIDE_FROM_RIGHT -> {
                        enterAnimation = R.animator.rns_slide_in_from_left
                        exitAnimation = R.animator.rns_slide_out_to_right
                    }
                    Screen.StackAnimation.SLIDE_FROM_LEFT -> {
                        enterAnimation = R.animator.rns_slide_in_from_right
                        exitAnimation = R.animator.rns_slide_out_to_left
                    }
                    Screen.StackAnimation.SLIDE_FROM_BOTTOM -> {
                        enterAnimation = R.animator.rns_no_animation_medium
                        exitAnimation = R.animator.rns_slide_out_to_bottom
                    }
                    Screen.StackAnimation.FADE_FROM_BOTTOM -> {
                        enterAnimation = R.animator.rns_no_animation_250
                        exitAnimation = R.animator.rns_fade_to_bottom
                    }
                    Screen.StackAnimation.IOS_FROM_RIGHT -> {
                        enterAnimation = R.animator.rns_ios_from_right_background_close
                        exitAnimation = R.animator.rns_ios_from_right_foreground_close
                    }
                    Screen.StackAnimation.IOS_FROM_LEFT -> {
                        enterAnimation = R.animator.rns_ios_from_left_background_close
                        exitAnimation = R.animator.rns_ios_from_left_foreground_close
                    }
                }
            }

            animatorSet =
                CustomAnimatorSetProvider.customize(
                    fragment.context,
                    if (enter) enterAnimation else exitAnimation,
                    (AnimatorInflater.loadAnimator(fragment.context, if (enter) enterAnimation else exitAnimation) as AnimatorSet),
                    fragment.screen,
                )
        } else {
            val dimmingDelegate = fragment.requireDimmingDelegate()
            val screen = fragment.screen

            if (enter) {
                val alphaAnimator =
                    ValueAnimator.ofFloat(0f, dimmingDelegate.maxAlpha).apply {
                        addUpdateListener { anim ->
                            val animatedValue = anim.animatedValue as? Float
                            animatedValue?.let { dimmingDelegate.dimmingView.alpha = it }
                        }
                    }
                val startValueCallback = { initialStartValue: Number? -> screen.height.toFloat() }
                val evaluator = ExternalBoundaryValuesEvaluator(startValueCallback, { 0f })
                val slideAnimator =
                    ValueAnimator.ofObject(evaluator, screen.height.toFloat(), 0f).apply {
                        addUpdateListener { anim ->
                            val animatedValue = anim.animatedValue as? Float
                            animatedValue?.let { screen.translationY = it }
                        }
                    }

                animatorSet
                    .play(slideAnimator)
                    .takeIf {
                        dimmingDelegate.willDimForDetentIndex(
                            screen,
                            screen.sheetInitialDetentIndex,
                        )
                    }?.with(alphaAnimator)
            } else {
                val alphaAnimator =
                    ValueAnimator.ofFloat(dimmingDelegate.dimmingView.alpha, 0f).apply {
                        addUpdateListener { anim ->
                            val animatedValue = anim.animatedValue as? Float
                            animatedValue?.let { dimmingDelegate.dimmingView.alpha = it }
                        }
                    }
                val slideAnimator =
                    ValueAnimator.ofFloat(0f, (fragment.coordinatorLayout.bottom - screen.top).toFloat()).apply {
                        addUpdateListener { anim ->
                            val animatedValue = anim.animatedValue as? Float
                            animatedValue?.let { screen.translationY = it }
                        }
                    }
                animatorSet.play(alphaAnimator).with(slideAnimator)
            }
        }
        // TODO(animations): coordinatorLayout, requireDimmingDelegate changed visibility to make this work

        animatorSet.addListener(
            ScreenAnimationDelegate(
                fragment,
                ScreenEventEmitter(fragment.screen),
                if (enter) {
                    ScreenAnimationDelegate.AnimationType.ENTER
                } else {
                    ScreenAnimationDelegate.AnimationType.EXIT
                },
            ),
        )
        return animatorSet
    }
}