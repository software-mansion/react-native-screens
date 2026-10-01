package com.swmansion.rnscreens.stack.header.toolbar.model

// Immutable, Drawable-free tree of data classes parsed from the `toolbarMenu`
// prop, so structural equality is sound (used to detect real prop changes).
internal data class StackHeaderToolbarMenuConfig(
    val groups: List<StackHeaderToolbarMenuGroupConfig>,
    val children: List<StackHeaderToolbarMenuElementConfig>,
)
