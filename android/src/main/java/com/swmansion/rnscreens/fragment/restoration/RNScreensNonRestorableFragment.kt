package com.swmansion.rnscreens.fragment.restoration

/**
 * Marks react-native-screens fragments that must not be restored from saved state.
 * [RNScreensFragmentFactory] uses this marker without relying on class names, which may be changed
 * by R8.
 */
internal interface RNScreensNonRestorableFragment
