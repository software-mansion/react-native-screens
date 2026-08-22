package com.swmansion.rnscreens.fragment.restoration

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentFactory

class RNScreensFragmentFactory : FragmentFactory() {
    override fun instantiate(
        classLoader: ClassLoader,
        className: String,
    ): Fragment =
        if (RNScreensFragment::class.java.isAssignableFrom(loadFragmentClass(classLoader, className))) {
            AutoRemovingFragment()
        } else {
            super.instantiate(classLoader, className)
        }
}
