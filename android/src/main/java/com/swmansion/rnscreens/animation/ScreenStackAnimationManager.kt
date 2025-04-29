package com.swmansion.rnscreens.animation

import android.animation.Animator
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
    private var stackAnimation: Screen.StackAnimation? = null
    private var shouldUseOpenAnimation: Boolean = true
    private val propertyAnimationFragments: MutableSet<ScreenStackFragment> = mutableSetOf()

    fun reset() {
        stackAnimation = null
        shouldUseOpenAnimation = true
        propertyAnimationFragments.clear()
    }

    fun configure(
        stackAnimation: Screen.StackAnimation?,
        shouldUseOpenAnimation: Boolean,
    ) {
        this.stackAnimation = stackAnimation
        this.shouldUseOpenAnimation = shouldUseOpenAnimation
    }

    fun updatePropertyAnimationFragmentsFromStack(stack: List<ScreenStackFragmentWrapper>) {
        val reversedStack = stack.reversed()
        var shouldUsePropertyAnimation = false

        // We want to use property animation for formSheets
        // and non-formSheet screens that are directly above/below formSheet
        for ((index, screenWrapper) in reversedStack.withIndex()) {
            if (screenWrapper is ScreenStackFragment) {
                val nextScreenIsFormSheet =
                    reversedStack.getOrNull(index + 1)?.screen?.usesFormSheetPresentation() ?: false

                if (screenWrapper.screen.usesFormSheetPresentation() ||
                    (!screenWrapper.screen.usesFormSheetPresentation() && nextScreenIsFormSheet)
                ) {
                    shouldUsePropertyAnimation = true
                }

                if (shouldUsePropertyAnimation) {
                    propertyAnimationFragments.add(screenWrapper)
                    if (!screenWrapper.screen.usesFormSheetPresentation()) {
                        shouldUsePropertyAnimation = false
                    }
                }
            }
        }
    }

    fun getAnimationForFragment(
        fragment: ScreenStackFragment,
        enter: Boolean,
    ): Animation? {
        if (propertyAnimationFragments.contains(fragment)) {
            return null
        }

        return AnimationUtils.loadAnimation(
            fragment.context,
            getAnimationResource(enter) ?: return null,
        )
    }

    fun getAnimatorForFragment(
        fragment: ScreenStackFragment,
        enter: Boolean,
    ): Animator? {
        if (!propertyAnimationFragments.contains(fragment)) {
            return null
        }

        val animator = getAnimator(fragment, enter) ?: return null

        animator.addListener(
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

        return animator
    }

    private fun getAnimationResource(enter: Boolean): Int? {
        return if (shouldUseOpenAnimation) {
            when (stackAnimation) {
                Screen.StackAnimation.DEFAULT ->
                    if (enter) R.anim.rns_default_enter_in else R.anim.rns_default_enter_out

                Screen.StackAnimation.NONE ->
                    R.anim.rns_no_animation_20

                Screen.StackAnimation.FADE ->
                    if (enter) R.anim.rns_fade_in else R.anim.rns_fade_out

                Screen.StackAnimation.SLIDE_FROM_RIGHT ->
                    if (enter) R.anim.rns_slide_in_from_right else R.anim.rns_slide_out_to_left

                Screen.StackAnimation.SLIDE_FROM_LEFT ->
                    if (enter) R.anim.rns_slide_in_from_left else R.anim.rns_slide_out_to_right

                Screen.StackAnimation.SLIDE_FROM_BOTTOM ->
                    if (enter) R.anim.rns_slide_in_from_bottom else R.anim.rns_no_animation_medium

                Screen.StackAnimation.FADE_FROM_BOTTOM ->
                    if (enter) R.anim.rns_fade_from_bottom else R.anim.rns_no_animation_350

                Screen.StackAnimation.IOS_FROM_RIGHT ->
                    if (enter) R.anim.rns_ios_from_right_foreground_open
                    else R.anim.rns_ios_from_right_background_open

                Screen.StackAnimation.IOS_FROM_LEFT ->
                    if (enter) R.anim.rns_ios_from_left_foreground_open
                    else R.anim.rns_ios_from_left_background_open

                else -> null
            }
        } else {
            when (stackAnimation) {
                Screen.StackAnimation.DEFAULT ->
                    if (enter) R.anim.rns_default_exit_in else R.anim.rns_default_exit_out

                Screen.StackAnimation.NONE ->
                    R.anim.rns_no_animation_20

                Screen.StackAnimation.FADE ->
                    if (enter) R.anim.rns_fade_in else R.anim.rns_fade_out

                Screen.StackAnimation.SLIDE_FROM_RIGHT ->
                    if (enter) R.anim.rns_slide_in_from_left else R.anim.rns_slide_out_to_right

                Screen.StackAnimation.SLIDE_FROM_LEFT ->
                    if (enter) R.anim.rns_slide_in_from_right else R.anim.rns_slide_out_to_left

                Screen.StackAnimation.SLIDE_FROM_BOTTOM ->
                    if (enter) R.anim.rns_no_animation_medium else R.anim.rns_slide_out_to_bottom

                Screen.StackAnimation.FADE_FROM_BOTTOM ->
                    if (enter) R.anim.rns_no_animation_250 else R.anim.rns_fade_to_bottom

                Screen.StackAnimation.IOS_FROM_RIGHT ->
                    if (enter) R.anim.rns_ios_from_right_background_close
                    else R.anim.rns_ios_from_right_foreground_close

                Screen.StackAnimation.IOS_FROM_LEFT ->
                    if (enter) R.anim.rns_ios_from_left_background_close
                    else R.anim.rns_ios_from_left_foreground_close

                else -> null
            }
        }
    }

    private fun getAnimator(
        fragment: ScreenStackFragment,
        enter: Boolean,
    ): Animator? {
        if (!fragment.screen.usesFormSheetPresentation()) {
            val animationResource = getAnimationResource(enter) ?: return null
            return CustomAnimatorProvider.getAnimatorFromAnimationResource(
                animationResource, fragment.context, fragment.screen
            )
        } else {
            val animatorSet = AnimatorSet()
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

            return animatorSet
        }
    }
}
