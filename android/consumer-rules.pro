# RNScreensFragmentFactory recognises library fragments by their package-name prefix when
# restoring saved state. Keep their names so R8 can't rename or repackage them.
-keepnames class com.swmansion.rnscreens.** extends androidx.fragment.app.Fragment

# Some views null-check fields in callbacks invoked from the super constructor, before their
# initializers have run. Keep fields so R8 full mode can't treat them as non-null and drop the checks.
-keepclassmembers class com.swmansion.rnscreens.** {
    <fields>;
}
