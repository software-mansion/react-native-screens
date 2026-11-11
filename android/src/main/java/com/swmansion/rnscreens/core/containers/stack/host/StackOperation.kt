package com.swmansion.rnscreens.core.containers.stack.host

import com.swmansion.rnscreens.core.containers.stack.screen.StackContainerItem

internal sealed class StackOperation

internal class PushOperation(
    val item: StackContainerItem,
) : StackOperation()

internal class PopOperation(
    val item: StackContainerItem,
) : StackOperation()
