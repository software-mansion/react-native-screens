package com.swmansion.rnscreens.fragment.restoration

class RNScreensFragmentFactory : androidx.fragment.app.FragmentFactory() {
    override fun instantiate(
        classLoader: ClassLoader,
        className: String,
    ): androidx.fragment.app.Fragment =
        if (className.startsWith(com.swmansion.rnscreens.BuildConfig.LIBRARY_PACKAGE_NAME)) {
            AutoRemovingFragment()
        } else {
            super.instantiate(classLoader, className)
        }
}
