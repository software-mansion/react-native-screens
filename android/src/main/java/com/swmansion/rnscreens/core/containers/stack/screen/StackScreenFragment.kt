package com.swmansion.rnscreens.core.containers.stack.screen

import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.swmansion.rnscreens.core.common.colorscheme.ColorSchemeProviding
import com.swmansion.rnscreens.core.containers.stack.animation.StackScreenTransitionProviding
import com.swmansion.rnscreens.core.containers.stack.animation.engine.StackTransitionSlot
import com.swmansion.rnscreens.core.containers.stack.header.StackHeaderBackPressHandler
import com.swmansion.rnscreens.core.containers.stack.header.StackHeaderCoordinatorLayout
import com.swmansion.rnscreens.core.containers.stack.host.StackUpdateBatchStateProviding
import java.lang.ref.WeakReference

internal class StackScreenFragment(
    internal val item: StackContainerItem,
    private val canNavigateBack: Boolean,
    private val delegate: WeakReference<StackScreenFragmentDelegate>,
    private val backPressHandler: WeakReference<StackHeaderBackPressHandler>,
    private val updateBatchStateProvider: WeakReference<StackUpdateBatchStateProviding>,
    private val colorSchemeProvider: WeakReference<ColorSchemeProviding>,
    private val transitionProvider: WeakReference<StackScreenTransitionProviding>,
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
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        headerCoordinatorLayout?.let { return it }

        return StackHeaderCoordinatorLayout(
            requireContext(),
            item,
            canNavigateBack,
            updateBatchStateProvider,
            colorSchemeProvider,
        ) { pressedItem ->
            backPressHandler.get()?.handleHeaderBackButtonPress(pressedItem)
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
        screenLifecycleEventEmitter = StackScreenAppearanceEventsEmitter(viewLifecycleOwner.lifecycle, item.appearanceEventEmitter)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        screenLifecycleEventEmitter = null
    }

    override fun onDestroy() {
        super.onDestroy()
        headerCoordinatorLayout?.tearDown()
        headerCoordinatorLayout = null
        // `isRemoving` is true only when this fragment is removed from its own stack (JS or native pop).
        // A fragment destroyed together with its FragmentManager (e.g. an ancestor screen was popped)
        // was not dismissed - reporting it would count as a native dismiss of a still-attached screen.
        if (isRemoving) {
            item.onDismiss()
        }
        teardownPreventNativeDismissCallback()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        delegate.get()?.onFragmentConfigurationChanged(newConfig)
    }

    // region Transitions

    // FragmentManager calls these once per operation it executes; the container answers, since only
    // it knows which operation that is and which screen's config governs it.

    override fun getEnterTransition(): Any? = resolveTransition(StackTransitionSlot.ENTER)

    override fun getExitTransition(): Any? = resolveTransition(StackTransitionSlot.EXIT)

    override fun getReturnTransition(): Any? = resolveTransition(StackTransitionSlot.RETURN)

    override fun getReenterTransition(): Any? = resolveTransition(StackTransitionSlot.REENTER)

    private fun resolveTransition(slot: StackTransitionSlot): Any? = transitionProvider.get()?.transitionFor(this, slot)

    // endregion

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
            PreventNativeDismissCallback(this, item, canBeEnabled = false)
        requireActivity().onBackPressedDispatcher.addCallback(
            requireNativeDismissBackPressedCallback,
        )
    }

    private fun teardownPreventNativeDismissCallback() {
        requireNativeDismissBackPressedCallback.remove()
        preventNativeDismissBackPressedCallback = null
    }

    companion object {
        private const val TAG = "StackScreenFragment"
    }
}
