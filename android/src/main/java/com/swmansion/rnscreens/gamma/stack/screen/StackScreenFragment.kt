package com.swmansion.rnscreens.gamma.stack.screen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.swmansion.rnscreens.gamma.stack.host.StackContainer
import java.lang.ref.WeakReference

class StackScreenFragment(
    internal val stackContainer: WeakReference<StackContainer>,
    internal val stackScreen: StackScreen,
) : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View = stackScreen

    override fun onStart() {
        stackScreen.eventEmitter.emitOnWillAppear()
        super.onStart()
    }

    override fun onResume() {
        stackScreen.eventEmitter.emitOnDidAppear()
        super.onResume()
    }

    override fun onPause() {
        stackScreen.eventEmitter.emitOnWillDisappear()
        super.onPause()
    }

    override fun onStop() {
        stackScreen.eventEmitter.emitOnDidDisappear()
        super.onStop()
    }

    override fun onDestroyView() {
        stackContainer.get()?.onFragmentDestroyView(this)
        stackScreen.eventEmitter.emitOnDismiss(stackScreen.activityMode == StackScreen.ActivityMode.ATTACHED)
        super.onDestroyView()
    }
}
