package com.swmansion.rnscreens

interface NativeDismissalObserver {
    /**
     * Observed object should call this observer method when it has been natively dismissed,
     * e.g. in the result of user gesture or other interaction.
     *
     * Prominent usage is for the screen with sheet presentation to notify its wrapper that
     * it has been hidden and requires dismissal.
     */
    fun onNativeDismiss(dismissed: ScreenStackFragmentWrapper)
}
