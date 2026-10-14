package com.swmansion.rnscreens.stack.host

import com.swmansion.rnscreens.stack.screen.StackContainerItem

internal sealed class StackOperation

internal class PushOperation(
    val item: StackContainerItem,
) : StackOperation()

internal class PopOperation(
    val item: StackContainerItem,
) : StackOperation()
