package com.swmansion.rnscreens.gamma.stack.screen

import android.animation.Animator
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.google.android.material.transition.MaterialSharedAxis

internal class StackScreenFragment(
    internal val stackScreen: StackScreen,
) : Fragment() {
    private var screenLifecycleEventEmitter: StackScreenAppearanceEventsEmitter? = null

    /**
     * This holds the screen strongly for now. Beware of retain cycle.
     *
     * Since each StackScreenFragment owns a PreventNativeDismissCallback & adds it to the
     * OnBackPressedDispatcher the callback should be enabled only when the top fragment is this fragment.
     */
    private val preventNativeDismissBackPressedCallback =
        PreventNativeDismissCallback(this, stackScreen, canBeEnabled = true)

    private var isTopFragment: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requireActivity().onBackPressedDispatcher.addCallback(
            preventNativeDismissBackPressedCallback,
        )
        enterTransition = MaterialSharedAxis(MaterialSharedAxis.X, true)
        returnTransition = MaterialSharedAxis(MaterialSharedAxis.X, false)
        reenterTransition = MaterialSharedAxis(MaterialSharedAxis.X, true)
        exitTransition = MaterialSharedAxis(MaterialSharedAxis.X, false)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = stackScreen

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?,
    ) {
        super.onViewCreated(view, savedInstanceState)
        screenLifecycleEventEmitter = stackScreen.createAppearanceEventsEmitter(viewLifecycleOwner)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        screenLifecycleEventEmitter = null
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i("StackScreenFragment", "onDestroy")
        stackScreen.onDismiss()
        preventNativeDismissBackPressedCallback.remove()
    }

    override fun onCreateAnimator(
        transit: Int,
        enter: Boolean,
        nextAnim: Int,
    ): Animator? {
        Log.w("RNScreens", "StackScreenFragment onCreateAnimator ${stackScreen.screenKey}")
        return super.onCreateAnimator(transit, enter, nextAnim)
//        return if (enter) {
//            val animator = ValueAnimator.ofFloat(-stackScreen.width.toFloat(), 0f).apply {
//                duration = 800
//                interpolator = FastOutSlowInInterpolator()
//                addUpdateListener { animator ->
//                    val animValue = animator.animatedValue as Float
//                    stackScreen.translationX = animValue
//                }
//            }
//            animator
//        } else {
//            val animator = ValueAnimator.ofFloat(0f, stackScreen.width.toFloat()).apply {
//                duration = 800
//                addUpdateListener { animator ->
//                    val animValue = animator.animatedValue as Float
//                    stackScreen.translationX = animValue
//                }
//            }
//            animator
//        }
    }

    /**
     * Notifies this fragment that it has become "top fragment" in its fragment manager.
     *
     * This function should be idempotent.
     */
    internal fun onBecomeTopFragment() {
        if (isTopFragment) return

        isTopFragment = true
        preventNativeDismissBackPressedCallback.canBeEnabled = true
    }

    /**
     * Notifies this fragment that it is not longer the "top fragment" in its fragment manager.
     *
     * This function should be idempotent.
     */
    internal fun onResignTopFragment() {
        if (!isTopFragment) return

        isTopFragment = false
        preventNativeDismissBackPressedCallback.canBeEnabled = false
    }
}
