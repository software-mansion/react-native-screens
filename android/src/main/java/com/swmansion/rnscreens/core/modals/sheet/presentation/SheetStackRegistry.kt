package com.swmansion.rnscreens.core.modals.sheet.presentation

internal object SheetStackRegistry {
    private val stack = mutableListOf<SheetPresentationManager>()

    internal fun register(sheet: SheetPresentationManager) {
        if (!stack.contains(sheet)) {
            stack.add(sheet)
        }
    }

    internal fun unregister(sheet: SheetPresentationManager) {
        stack.remove(sheet)
    }

    internal fun sheetsAbove(sheet: SheetPresentationManager): List<SheetPresentationManager> {
        val index = stack.indexOf(sheet)
        if (index < 0) {
            return emptyList()
        }
        return stack.drop(index + 1)
    }

    internal fun sheetBelow(sheet: SheetPresentationManager): SheetPresentationManager? {
        val index = stack.indexOf(sheet)
        return if (index > 0) stack[index - 1] else null
    }
}
