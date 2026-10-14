package com.swmansion.rnscreens.stack.host

import com.swmansion.rnscreens.stack.screen.StackScreenItem

internal sealed class StackOperation

internal class PushOperation(
    val screen: StackScreenItem,
) : StackOperation()

internal class PopOperation(
    val screen: StackScreenItem,
) : StackOperation()
