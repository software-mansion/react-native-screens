package com.swmansion.rnscreens.gamma.stack.host

import com.swmansion.rnscreens.gamma.stack.screen.StackScreen

internal sealed class StackOperation

internal class PushOperation(
    val screen: StackScreen,
) : StackOperation()

internal class PopOperation(
    val screen: StackScreen,
) : StackOperation()
