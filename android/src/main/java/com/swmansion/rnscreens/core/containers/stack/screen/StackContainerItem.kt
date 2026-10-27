package com.swmansion.rnscreens.core.containers.stack.screen

import android.view.View
import com.swmansion.rnscreens.core.common.event.ViewAppearanceEventEmitter
import com.swmansion.rnscreens.core.containers.common.ContainerItem
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackTransitionKind
import com.swmansion.rnscreens.core.containers.stack.header.config.OnHeaderConfigurationAttachListener

/**
 * What the stack container, its fragments and the header need from an item of the stack.
 */
internal interface StackContainerItem : ContainerItem {
    /**
     * The view displaying the screen's content.
     */
    val view: View

    val itemKey: String?

    val isPreventNativeDismissEnabled: Boolean

    /**
     * The `animation` prop value used for transitions to and from this item.
     */
    val animation: StackAnimationConfig

    val replaceAnimation: StackTransitionKind

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
