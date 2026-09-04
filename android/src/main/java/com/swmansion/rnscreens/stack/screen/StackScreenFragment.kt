package com.swmansion.rnscreens.stack.screen

import android.content.res.Configuration
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.transition.Slide
import com.swmansion.rnscreens.stack.header.StackHeaderCoordinatorLayout
import java.lang.ref.WeakReference

internal class StackScreenFragment(
    internal val stackScreen: StackScreen,
    private val canNavigateBack: Boolean,
    private val delegate: WeakReference<StackScreenFragmentDelegate>,
) : Fragment() {
    private var screenLifecycleEventEmitter: StackScreenAppearanceEventsEmitter? = null

    /**
     * Retained across fragment view destruction (e.g. tab switches detaching the fragment), so that
     * the app bar scroll offset and the built header survive reattachment. FragmentManager removes
     * the view from its container before `onDestroyView`, so `onCreateView` can return it as-is.
     */
    private var headerCoordinatorLayout: StackHeaderCoordinatorLayout? = null

    /**
     * This holds the screen strongly for now. Beware of retain cycle.
     *
     * Since each StackScreenFragment owns a PreventNativeDismissCallback & adds it to the
     * OnBackPressedDispatcher the callback should be enabled only when the top fragment is this fragment.
     */
    private var preventNativeDismissBackPressedCallback: PreventNativeDismissCallback? = null
    private val requireNativeDismissBackPressedCallback
        get() = checkNotNull(preventNativeDismissBackPressedCallback) { "[RNScreens] Attempt to require nullish OnBackPressedCallback" }

    private var isTopFragment: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setupPreventNativeDismissCallback()

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
    ): View {
        headerCoordinatorLayout?.let { return it }

        return StackHeaderCoordinatorLayout(requireContext(), stackScreen, canNavigateBack)
            .also { headerCoordinatorLayout = it }
    }

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
        headerCoordinatorLayout?.tearDown()
        headerCoordinatorLayout = null
        stackScreen.onDismiss()
        teardownPreventNativeDismissCallback()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        delegate.get()?.onFragmentConfigurationChanged(newConfig)
    }

    /**
     * Notifies this fragment that it has become "top fragment" in its fragment manager.
     * Call this only if the lifecycle of the fragment is at least at CREATED.
     *
     * This function should be idempotent.
     */
    internal fun onBecomeTopFragment() {
        if (isTopFragment) return

        isTopFragment = true
        requireNativeDismissBackPressedCallback.canBeEnabled = true
    }

    /**
     * Notifies this fragment that it is not longer the "top fragment" in its fragment manager.
     * Call this only if the lifecycle of the fragment is at least at CREATED.
     *
     * This function should be idempotent.
     */
    internal fun onResignTopFragment() {
        if (!isTopFragment) return

        isTopFragment = false
        requireNativeDismissBackPressedCallback.canBeEnabled = false
    }

    private fun setupPreventNativeDismissCallback() {
        preventNativeDismissBackPressedCallback =
            PreventNativeDismissCallback(this, stackScreen, canBeEnabled = false)
        requireActivity().onBackPressedDispatcher.addCallback(
            requireNativeDismissBackPressedCallback,
        )
    }

    private fun teardownPreventNativeDismissCallback() {
        requireNativeDismissBackPressedCallback.remove()
        preventNativeDismissBackPressedCallback = null
    }
}
