package com.swmansion.rnscreens.stack.host

import androidx.fragment.app.FragmentManager
import com.swmansion.rnscreens.stack.screen.StackScreen

internal interface StackContainerDelegate {
    fun onScreenDismissCommitted(stackScreen: StackScreen)

    /**
     * Resolves the fragment manager the container should run its operations on. Called every time the container
     * is attached to a window, as the result may differ between attachments.
     */
    fun resolveFragmentManager(): FragmentManager
}
