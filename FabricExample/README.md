# React Native Screens example app that uses fabric architecture

## Installing & running application

Before running application you need to install all dependencies. To do that:
- In project root run `yarn install`
- In FabricExample run `yarn install`

### Android

To run this application on Android you need to have Java 11 active on your computer. You can check what version you are using by running `javac --version`. You can change it by changing `JAVA_HOME` environment variable or in Android Studio settings.

Then you can run this application by `yarn android` or from Android Studio.

### iOS

To run on iOS first go to `FabricExample/ios` and run `RCT_NEW_ARCH_ENABLED=1 pod install`. This will install pods for Fabric architecture.

Then in `FabricExample` run `yarn ios` or run application from Xcode.