# RNScreensFragmentFactory checks this marker relationship after loading fragments by name.
# Preserve it for live implementations while still allowing shrinking and obfuscation.
-keep,allowobfuscation interface com.swmansion.rnscreens.fragment.restoration.RNScreensNonRestorableFragment
-keep,allowobfuscation,allowshrinking class * implements com.swmansion.rnscreens.fragment.restoration.RNScreensNonRestorableFragment
