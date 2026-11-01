package com.swmansion.rnscreens.core.containers.stack.host

import androidx.fragment.app.FragmentManager
import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem

internal interface StackContainerDelegate {
    fun onItemDismissCommitted(item: StackContainerItem)

    /**
     * Resolves the fragment manager the container should run its operations on. Called every time the container
     * is attached to a window, as the result may differ between attachments.
     */
    fun resolveFragmentManager(): FragmentManager
}
