# React Native Screens - Fabric version

To use this library with your fabric application:
1. Download the [tgz package](packages/react-native-screens-0.0.0-20220207-fabric.tgz).
2. Add the dependency in `package.json` - for example:  `"react-native-screens": "./react-native-screens-0.0.0-20220207-fabric.tgz"`
3. iOS
    - Install pods using `RCT_NEW_ARCH_ENABLED=1 pod install` (iOS only)
4. Android
    - Similar to [this change](https://github.com/software-mansion/react-native-screens/pull/1263/files#diff-3b92f5f55f60a7bb92c779ec84a6608d0d53fb4009de9ec054d9da0698f5645a) add `import com.swmansion.rnscreens.RNScreensComponentRegistry;` and `RNScreensComponentRegistry.register(componentFactory);` to `ReactNativeHost` in your Application.
    - Add `librnscreens_modules` to app Android.mk. Similar to [this change](https://github.com/software-mansion/react-native-screens/pull/1308/files#diff-a6880655dffeac0a41f51b542a9bf126174bfd1f44963ec877a39ccca69c1fe6L45-R48)
