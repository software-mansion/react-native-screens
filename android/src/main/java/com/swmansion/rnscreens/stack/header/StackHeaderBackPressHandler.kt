package com.swmansion.rnscreens.stack.header

import com.swmansion.rnscreens.stack.screen.StackContainerItem

/**
 * Receives presses of the native header back button. Implemented by the object
 * managing the navigation state of the stack the pressed header belongs to.
 */
internal fun interface StackHeaderBackPressHandler {
    fun handleHeaderBackButtonPress(pressedItem: StackContainerItem)
}
