package com.swmansion.rnscreens

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentFactory

class RNScreensFragmentFactory : FragmentFactory() {
    override fun instantiate(classLoader: ClassLoader, className: String): Fragment {
        return if (className.startsWith(BuildConfig.LIBRARY_PACKAGE_NAME)) {
            AutoRemovingFragment();
        } else {
            super.instantiate(classLoader, className)
        }
    }
}
