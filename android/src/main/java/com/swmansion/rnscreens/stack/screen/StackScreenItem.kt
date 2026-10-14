package com.swmansion.rnscreens.stack.screen

import android.view.View
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.core.containers.common.ContainerItem
import com.swmansion.rnscreens.stack.header.config.OnHeaderConfigurationAttachListener

/**
 * What the stack container, its fragments and the header need from a stack screen.
 */
internal interface StackScreenItem : ContainerItem {
    /**
     * The view displaying the screen's content.
     */
    val view: View

    val screenKey: String?

    val isPreventNativeDismissEnabled: Boolean

    /**
     * Use this to set/unset the observer.
     */
    var preventNativeDismissChangeObserver: PreventNativeDismissChangeObserver?

    val appearanceEventEmitter: ViewAppearanceEventEmitter

    fun onContentYOriginChanged(y: Int)

    fun onDismiss()

    fun onNativeDismissPrevented()

    fun registerHeaderConfigAttachListener(listener: OnHeaderConfigurationAttachListener)

    fun clearHeaderConfigAttachListener()
}
