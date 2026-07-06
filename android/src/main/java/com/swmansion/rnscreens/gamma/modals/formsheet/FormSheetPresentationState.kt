package com.swmansion.rnscreens.gamma.modals.formsheet

internal enum class FormSheetPresentationState {
    /**
     * The dialog is not showing (it hasn't been shown yet or `dialog.dismiss()` has been called).
     * No animations are currently running.
     * From this state, the manager can only transition to [PRESENTING]
     * when `presentIfNeeded()` is triggered.
     */
    DISMISSED,

    /**
     * The manager is currently hiding the sheet. `dismissIfNeeded()` has been called.
     * It runs exit animation and once the exit animator finishes (or the sheet was already hidden),
     * `performDismiss()` is called which triggers `dialog.dismiss()` and moves the state to [DISMISSED].
     * **Transitional state** from [PRESENTED] to [DISMISSED].
     */
    DISMISSING,

    /**
     * The dialog is attached to the window and the entrance animation has successfully finished.
     * From this state, the manager can only transition to [DISMISSING]
     * when `dismissIfNeeded()` is triggered.
     */
    PRESENTED,

    /**
     * The manager is actively preparing to show the sheet. `presentIfNeeded()` has been called.
     * During this state, `dialog.show()` is executed. The manager waits for the `onShowListener`
     * to fire, requests DimmingView attachment from `dimmingManager` and runs starts entrance animation.
     * Once the enter animator finishes, the state moves to [PRESENTED].
     * **Transitional state** from [DISMISSED] to [PRESENTED].
     */
    PRESENTING,
}
