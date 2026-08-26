package com.swmansion.rnscreens.modals.formsheet.native.presentation

internal object FormSheetStackRegistry {
    private val stack = mutableListOf<FormSheetPresentationManager>()

    internal fun register(sheet: FormSheetPresentationManager) {
        if (!stack.contains(sheet)) {
            stack.add(sheet)
        }
    }

    internal fun unregister(sheet: FormSheetPresentationManager) {
        stack.remove(sheet)
    }

    internal fun sheetsAbove(sheet: FormSheetPresentationManager): List<FormSheetPresentationManager> {
        val index = stack.indexOf(sheet)
        if (index < 0) {
            return emptyList()
        }
        return stack.drop(index + 1)
    }

    internal fun sheetBelow(sheet: FormSheetPresentationManager): FormSheetPresentationManager? {
        val index = stack.indexOf(sheet)
        return if (index > 0) stack[index - 1] else null
    }
}
