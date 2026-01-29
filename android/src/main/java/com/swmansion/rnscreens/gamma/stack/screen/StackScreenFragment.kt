package com.swmansion.rnscreens.gamma.stack.screen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.swmansion.rnscreens.gamma.stack.host.StackContainer
import java.lang.ref.WeakReference

internal class StackScreenFragment(
    private val stackContainer: WeakReference<StackContainer>,
    internal val stackScreen: StackScreen,
) : Fragment() {
    private var screenLifecycleEventEmitter: StackScreenAppearanceEventsEmitter? = null

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
        stackScreen.onDismiss()
        stackContainer.get()?.onFragmentDestroyView(this)
        screenLifecycleEventEmitter = null
    }
}
