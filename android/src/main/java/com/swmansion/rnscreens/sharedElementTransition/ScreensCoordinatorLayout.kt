package com.swmansion.rnscreens.sharedElementTransition

import android.content.Context
import android.view.animation.Animation
import android.view.animation.AnimationSet
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.fragment.app.Fragment
import com.swmansion.common.ScreenStackFragmentCommon

class ScreensCoordinatorLayout(
    context: Context,
    private val mFragment: ScreenStackFragmentCommon
) : CoordinatorLayout(context) {
    private val mAnimationListener: Animation.AnimationListener =
        object : Animation.AnimationListener {
            override fun onAnimationStart(animation: Animation) {
                mFragment.onViewAnimationStart()
            }

            override fun onAnimationEnd(animation: Animation) {
                mFragment.onViewAnimationEnd()
            }

            override fun onAnimationRepeat(animation: Animation) {}
        }

    override fun startAnimation(animation: Animation) {
        // For some reason View##onAnimationEnd doesn't get called for
        // exit transitions so we explicitly attach animation listener.
        // We also have some animations that are an AnimationSet, so we don't wrap them
        // in another set since it causes some visual glitches when going forward.
        // We also set the listener only when going forward, since when going back,
        // there is already a listener for dismiss action added, which would be overridden
        // and also this is not necessary when going back since the lifecycle methods
        // are correctly dispatched then.
        // We also add fakeAnimation to the set of animations, which sends the progress of animation
        val fakeAnimation = ScreensAnimation(mFragment).apply { duration = animation.duration }

        if (animation is AnimationSet && !(mFragment as Fragment).isRemoving) {
            animation.apply {
                addAnimation(fakeAnimation)
                setAnimationListener(mAnimationListener)
            }.also {
                super.startAnimation(it)
            }
        } else {
            AnimationSet(true).apply {
                addAnimation(animation)
                addAnimation(fakeAnimation)
                setAnimationListener(mAnimationListener)
            }.also {
                super.startAnimation(it)
            }
        }
    }

    /**
     * This method implements a workaround for RN's autoFocus functionality. Because of the way
     * autoFocus is implemented it dismisses soft keyboard in fragment transition
     * due to change of visibility of the view at the start of the transition. Here we override the
     * call to `clearFocus` when the visibility of view is `INVISIBLE` since `clearFocus` triggers the
     * hiding of the keyboard in `ReactEditText.java`.
     */
    override fun clearFocus() {
        if (visibility != INVISIBLE) {
            super.clearFocus()
        }
    }
}
