package com.swmansion.rnscreens.gamma.stack.host

import com.swmansion.rnscreens.gamma.stack.screen.StackScreen

internal interface StackContainerDelegate {
    fun onDismiss(stackScreen: StackScreen)
}
