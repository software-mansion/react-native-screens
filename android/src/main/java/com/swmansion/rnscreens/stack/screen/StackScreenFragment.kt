package com.swmansion.rnscreens.stack.screen

import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.transition.Slide
import com.swmansion.rnscreens.stack.header.StackHeaderBackPressHandler
import com.swmansion.rnscreens.stack.header.StackHeaderCoordinatorLayout
import java.lang.ref.WeakReference

internal class StackScreenFragment(
    internal val stackScreen: StackScreen,
    private val canNavigateBack: Boolean,
    private val delegate: WeakReference<StackScreenFragmentDelegate>,
    backPressHandler: StackHeaderBackPressHandler,
) : Fragment() {
    // Weakly held so that a fragment retained by FragmentManager past container teardown
    // does not keep the container view subtree alive.
    private val backPressHandler: WeakReference<StackHeaderBackPressHandler> = WeakReference(backPressHandler)
    private var screenLifecycleEventEmitter: StackScreenAppearanceEventsEmitter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        allowEnterTransitionOverlap = true
        allowReturnTransitionOverlap = true

        enterTransition = Slide(Gravity.RIGHT)
        exitTransition = Slide(Gravity.LEFT)
        returnTransition = Slide(Gravity.RIGHT)
        reenterTransition = Slide(Gravity.LEFT)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View =
        StackHeaderCoordinatorLayout(requireContext(), stackScreen, canNavigateBack) { pressedScreen ->
            backPressHandler.get()?.handleHeaderBackButtonPress(pressedScreen)
                ?: Log.w(TAG, "[RNScreens] Header back button press dropped - handler is gone")
        }

    override fun onViewCreated(
        view: View,
        savedInstanceState: Bundle?,
    ) {
        super.onViewCreated(view, savedInstanceState)
        screenLifecycleEventEmitter = stackScreen.createAppearanceEventsEmitter(viewLifecycleOwner)
    }

    override fun onDestroyView() {
        val coordinatorLayout = view
        check(coordinatorLayout is StackHeaderCoordinatorLayout) {
            "[RNScreens] Unexpected fragment view type: $view"
        }
        coordinatorLayout.tearDown()
        super.onDestroyView()
        screenLifecycleEventEmitter = null
    }

    override fun onDestroy() {
        super.onDestroy()
        stackScreen.onDismiss()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        delegate.get()?.onFragmentConfigurationChanged(newConfig)
    }

    companion object {
        private const val TAG = "StackScreenFragment"
    }
}
