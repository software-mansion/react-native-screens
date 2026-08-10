package com.swmansion.rnscreens.modals.formsheet.native.presentation

import com.swmansion.rnscreens.modals.formsheet.native.interfaces.FormSheetStackEntry

internal object FormSheetStackCoordinator {
    private val sheets = mutableListOf<FormSheetStackEntry>()

    internal fun onSheetPresentationStart(sheet: FormSheetStackEntry) {
        if (!sheets.contains(sheet)) {
            sheets.add(sheet)
            reconcileCoverage()
        }
    }

    // Dismissing a sheet from the middle of the stack dismisses all sheets above it,
    // mirroring the iOS presentation chain teardown. Sheets are dismissed top-down.
    internal fun onSheetDismissalStart(sheet: FormSheetStackEntry) {
        sheetsAbove(sheet).asReversed().forEach {
            it.onSheetBelowDismissed()
        }
    }

    internal fun onSheetDismissalEnd(sheet: FormSheetStackEntry) {
        if (sheets.remove(sheet)) {
            reconcileCoverage()
        }
    }

    internal fun onDimmingRatioChanged(sheet: FormSheetStackEntry) {
        sheetBelow(sheet)?.coverageRatio = sheet.dimmingRatio
    }

    private fun sheetsAbove(sheet: FormSheetStackEntry): List<FormSheetStackEntry> {
        val index = sheets.indexOf(sheet)
        if (index < 0) {
            return emptyList()
        }
        return sheets.drop(index + 1)
    }

    private fun sheetBelow(sheet: FormSheetStackEntry): FormSheetStackEntry? {
        val index = sheets.indexOf(sheet)
        return if (index > 0) sheets[index - 1] else null
    }

    private fun reconcileCoverage() {
        sheets.forEachIndexed { index, sheet ->
            sheet.coverageRatio = sheets.getOrNull(index + 1)?.dimmingRatio ?: 0f
        }
    }
}