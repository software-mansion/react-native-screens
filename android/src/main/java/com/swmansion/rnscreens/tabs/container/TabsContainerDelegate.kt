package com.swmansion.rnscreens.tabs.container

import androidx.fragment.app.FragmentManager

internal interface TabsContainerDelegate {
    /**
     * Resolves the fragment manager the container should run its operations on. Called every time the container
     * is attached to a window, as the result may differ between attachments.
     */
    fun resolveFragmentManager(): FragmentManager
}
