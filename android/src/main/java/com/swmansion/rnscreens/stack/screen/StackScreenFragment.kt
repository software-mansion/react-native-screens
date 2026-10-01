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
import com.swmansion.rnscreens.common.colorscheme.ColorSchemeProviding
import com.swmansion.rnscreens.stack.header.StackHeaderBackPressHandler
import com.swmansion.rnscreens.stack.header.StackHeaderCoordinatorLayout
import com.swmansion.rnscreens.stack.host.StackUpdateBatchStateProviding
import java.lang.ref.WeakReference

internal class StackScreenFragment(
    internal val stackScreen: StackScreen,
    private val canNavigateBack: Boolean,
    private val delegate: WeakReference<StackScreenFragmentDelegate>,
    private val backPressHandler: WeakReference<StackHeaderBackPressHandler>,
    private val updateBatchStateProvider: WeakReference<StackUpdateBatchStateProviding>,
    private val colorSchemeProvider: WeakReference<ColorSchemeProviding>,
) : Fragment() {
    private var screenLifecycleEventEmitter: StackScreenAppearanceEventsEmitter? = null

    /**
     * Retained across fragment view destruction (e.g. tab switches detaching the fragment), so that
     * the app bar scroll offset and the built header survive reattachment. FragmentManager removes
     * the view from its container before `onDestroyView`, so `onCreateView` can return it as-is.
     */
    private var headerCoordinatorLayout: StackHeaderCoordinatorLayout? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        allowEnterTransitionOverlap = true
        allowReturnTransitionOverlap = true

        enterTransition = Slide(Gravity.END)
        exitTransition = Slide(Gravity.START)
        returnTransition = Slide(Gravity.END)
        reenterTransition = Slide(Gravity.START)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        headerCoordinatorLayout?.let { return it }

        return StackHeaderCoordinatorLayout(
            requireContext(),
            stackScreen,
            canNavigateBack,
            updateBatchStateProvider,
            colorSchemeProvider,
        ) { pressedScreen ->
            backPressHandler.get()?.handleHeaderBackButtonPress(pressedScreen)
                ?: Log.w(TAG, "[RNScreens] Header back button press dropped - handler is gone")
        }.also { headerCoordinatorLayout = it }
    }

    internal fun flushPendingHeaderUpdates() {
        headerCoordinatorLayout?.flushPendingUpdates()
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
    }

    override fun onPrimaryNavigationFragmentChanged(isPrimaryNavigationFragment: Boolean) {
        super.onPrimaryNavigationFragmentChanged(isPrimaryNavigationFragment)
        // Delivered only when this fragment's own status changed; FragmentManager recurses into the
        // child FragmentManager by itself. The container nested in this screen, if it exists yet,
        // has to re-evaluate its system back veto.
        stackScreen.resolveNestedContainer()?.onOwnerPrimaryNavigationFragmentChanged()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        delegate.get()?.onFragmentConfigurationChanged(newConfig)
    }

    companion object {
        private const val TAG = "StackScreenFragment"
    }
}
