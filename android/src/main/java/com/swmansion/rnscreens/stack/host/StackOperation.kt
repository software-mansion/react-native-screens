package com.swmansion.rnscreens.stack.host

import com.swmansion.rnscreens.stack.screen.StackScreen

internal sealed class StackOperation

internal class PushOperation(
    val screen: StackScreen,
) : StackOperation()

internal class PopOperation(
    val screen: StackScreen,
) : StackOperation()
