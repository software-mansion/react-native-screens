# React Native Screens - Fabric version

To use this library with your Fabric application, you have to:

1. Add latest react-native-screens
2. on iOS
   - Install pods using `RCT_NEW_ARCH_ENABLED=1 pod install` – this is the same command you run to prepare a Fabric build but you also need to run it after a new native library gets added.
3. on Android
   - There are no additional steps required so long you app is configured to build with Fabric – this is typically configured by setting `newArchEnabled=true` in `gradle.properties` file in your project.
