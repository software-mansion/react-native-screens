# React Native Screens example app that uses fabric architecture

## Installing & running application

Before running application you need to install all dependencies. To do that:
- In project root run `yarn install`
- In FabricExample run `yarn install`

### Android

To run this application on Android simply run `yarn android` or run application from Android Studio.

### iOS

To run on iOS first go to `FabricExample/ios` and run `RCT_NEW_ARCH_ENABLED=1 pod install`. This will install pods for Fabric architecture.

Then in `FabricExample` run `yarn ios` or run application from Xcode.