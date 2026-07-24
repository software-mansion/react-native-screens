package com.swmansion.rnscreens.stack.host

import com.swmansion.rnscreens.stack.screen.StackScreen

internal interface StackContainerDelegate {
    fun onScreenDismissCommitted(stackScreen: StackScreen)
}
