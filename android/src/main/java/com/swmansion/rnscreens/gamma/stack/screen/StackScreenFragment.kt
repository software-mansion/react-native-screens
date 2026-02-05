package com.swmansion.rnscreens.gamma.stack.screen

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

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
