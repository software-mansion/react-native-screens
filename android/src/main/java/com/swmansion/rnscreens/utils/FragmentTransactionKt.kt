package com.swmansion.rnscreens.utils

import androidx.fragment.app.FragmentTransaction
import com.swmansion.rnscreens.R
import com.swmansion.rnscreens.Screen.StackAnimation

internal fun FragmentTransaction.setTweenAnimations(stackAnimation: StackAnimation, shouldUseOpenAnimation: Boolean) {
    if (shouldUseOpenAnimation) {
        when (stackAnimation) {
            StackAnimation.DEFAULT ->
                this.setCustomAnimations(
                    R.anim.rns_default_enter_in,
                    R.anim.rns_default_enter_out,
                )

            StackAnimation.NONE ->
                this.setCustomAnimations(
                    R.anim.rns_no_animation_20,
                    R.anim.rns_no_animation_20,
                )

            StackAnimation.FADE ->
                this.setCustomAnimations(
                    R.anim.rns_fade_in,
                    R.anim.rns_fade_out,
                )

            StackAnimation.SLIDE_FROM_RIGHT ->
                this.setCustomAnimations(
                    R.anim.rns_slide_in_from_right,
                    R.anim.rns_slide_out_to_left,
                )
            StackAnimation.SLIDE_FROM_LEFT ->
                this.setCustomAnimations(
                    R.anim.rns_slide_in_from_left,
                    R.anim.rns_slide_out_to_right,
                )
            StackAnimation.SLIDE_FROM_BOTTOM ->
                this.setCustomAnimations(
                    R.anim.rns_slide_in_from_bottom,
                    R.anim.rns_no_animation_medium,
                )
            StackAnimation.FADE_FROM_BOTTOM -> this.setCustomAnimations(R.anim.rns_fade_from_bottom, R.anim.rns_no_animation_350)
            StackAnimation.IOS_FROM_RIGHT ->
                this.setCustomAnimations(
                    R.anim.rns_ios_from_right_foreground_open,
                    R.anim.rns_ios_from_right_background_open,
                )
            StackAnimation.IOS_FROM_LEFT ->
                this.setCustomAnimations(
                    R.anim.rns_ios_from_left_foreground_open,
                    R.anim.rns_ios_from_left_background_open,
                )
        }
    } else {
        when (stackAnimation) {
            StackAnimation.DEFAULT ->
                this.setCustomAnimations(
                    R.anim.rns_default_exit_in,
                    R.anim.rns_default_exit_out,
                )

            StackAnimation.NONE ->
                this.setCustomAnimations(
                    R.anim.rns_no_animation_20,
                    R.anim.rns_no_animation_20,
                )

            StackAnimation.FADE ->
                this.setCustomAnimations(
                    R.anim.rns_fade_in,
                    R.anim.rns_fade_out,
                )

            StackAnimation.SLIDE_FROM_RIGHT ->
                this.setCustomAnimations(
                    R.anim.rns_slide_in_from_left,
                    R.anim.rns_slide_out_to_right,
                )
            StackAnimation.SLIDE_FROM_LEFT ->
                this.setCustomAnimations(
                    R.anim.rns_slide_in_from_right,
                    R.anim.rns_slide_out_to_left,
                )
            StackAnimation.SLIDE_FROM_BOTTOM ->
                this.setCustomAnimations(
                    R.anim.rns_no_animation_medium,
                    R.anim.rns_slide_out_to_bottom,
                )
            StackAnimation.FADE_FROM_BOTTOM -> this.setCustomAnimations(R.anim.rns_no_animation_250, R.anim.rns_fade_to_bottom)
            StackAnimation.IOS_FROM_RIGHT ->
                this.setCustomAnimations(
                    R.anim.rns_ios_from_right_background_close,
                    R.anim.rns_ios_from_right_foreground_close,
                )
            StackAnimation.IOS_FROM_LEFT ->
                this.setCustomAnimations(
                    R.anim.rns_ios_from_left_background_close,
                    R.anim.rns_ios_from_left_foreground_close,
                )
        }
    }
}
