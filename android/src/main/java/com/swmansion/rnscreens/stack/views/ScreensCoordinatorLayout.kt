package com.swmansion.rnscreens.stack.views

import android.content.Context
import android.view.WindowInsets
import android.view.animation.Animation
import android.view.animation.AnimationSet
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.uimanager.ReactPointerEventsView
import com.swmansion.rnscreens.PointerEventsBoxNoneImpl
import com.swmansion.rnscreens.ScreenStackFragment
import com.swmansion.rnscreens.bottomsheet.usesFormSheetPresentation
import com.swmansion.rnscreens.stack.anim.ScreensAnimation

internal class ScreensCoordinatorLayout(
    context: Context,
    internal val fragment: ScreenStackFragment,
    private val pointerEventsImpl: ReactPointerEventsView,
) : CoordinatorLayout(context),
    ReactPointerEventsView by pointerEventsImpl {
    constructor(context: Context, fragment: ScreenStackFragment) : this(
        context,
        fragment,
        PointerEventsBoxNoneImpl(),
    )

    internal var blockFrameworkTransitionFinalization = false
    internal var needsTransitionFinalization = false

    override fun onApplyWindowInsets(insets: WindowInsets?): WindowInsets = super.onApplyWindowInsets(insets)

    private val animationListener: Animation.AnimationListener =
        object : Animation.AnimationListener {
            override fun onAnimationStart(animation: Animation) {
                fragment.onViewAnimationStart()
            }

            override fun onAnimationEnd(animation: Animation) {
                if (blockFrameworkTransitionFinalization) {
                    blockFrameworkTransitionFinalization = false
                    needsTransitionFinalization = true
                }
                fragment.onViewAnimationEnd()
                needsTransitionFinalization = false
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
        val fakeAnimation = ScreensAnimation(fragment).apply { duration = animation.duration }

        if (fragment.isRemoving) {
            // This is a hack.
            // We'll finalize the transition via our listener.
            // We do it to prevent the framework from ending the transition prematurely,
            // due to interaction between `FragmentAnim.EndViewTransitionAnimation` and
            // `SafeAreaView` drawing blocking logic. For detailed description see:
            // https://github.com/software-mansion/react-native-screens/pull/4161
            blockFrameworkTransitionFinalization = true
        }

        if (animation is AnimationSet && !fragment.isRemoving) {
            animation
                .apply {
                    addAnimation(fakeAnimation)
                    setAnimationListener(animationListener)
                }.also {
                    super.startAnimation(it)
                }
        } else {
            AnimationSet(true)
                .apply {
                    addAnimation(animation)
                    addAnimation(fakeAnimation)
                    setAnimationListener(animationListener)
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

    override fun onLayout(
        changed: Boolean,
        l: Int,
        t: Int,
        r: Int,
        b: Int,
    ) {
        super.onLayout(changed, l, t, r, b)

        if (fragment.screen.usesFormSheetPresentation()) {
            fragment.screen.onBottomSheetBehaviorDidLayout(changed)
        }
    }
}
