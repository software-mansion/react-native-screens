# RNScreensFragmentFactory recognises library fragments by their package-name prefix when
# restoring saved state. Keep their names so R8 can't rename or repackage them.
-keepnames class com.swmansion.rnscreens.** extends androidx.fragment.app.Fragment
