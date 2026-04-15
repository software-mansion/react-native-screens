package com.swmansion.rnscreens

interface ScreenStackFragmentWrapper : ScreenFragmentWrapper {
    // Toolbar management
    fun removeToolbar()

    fun setToolbar(toolbar: CustomToolbar)

    fun setToolbarShadowHidden(hidden: Boolean)

    fun setToolbarTranslucent(translucent: Boolean)

    // Navigation
    fun canNavigateBack(): Boolean

    /**
     * Removes this fragment from the container it/it's screen belongs to.
     */
    fun dismissFromContainer()
}
