<img src="https://user-images.githubusercontent.com/16062886/117443651-c13d9500-af38-11eb-888d-b6a0b580760c.png" width="100%" alt="React Native Screens by Software Mansion" >


This project aims to expose native navigation container components to React Native. It is not designed to be used as a standalone library but rather as a dependency of a [full-featured navigation library](https://github.com/react-navigation/react-navigation).

## Installation

### iOS

Installation on iOS should be completely handled with auto-linking, if you have ensured pods are installed after adding this module, no other actions should be necessary

### Android

On Android the View state is not persisted consistently across Activity restarts, which can lead to crashes in those cases. It is recommended to override the native Android method called on Activity restarts in your main Activity, to avoid these crashes.

For most people using an app built from the react-native template, that means editing `MainActivity.java`, likely located in `android/app/src/main/java/<your package name>/MainActivity.java`

You should add this code, which specifically discards any Activity state persisted during the Activity restart process, to avoid inconsistencies that lead to crashes.

```java
import android.os.Bundle;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
}
```

For people that must handle cases like this, there is [a more detailed discussion of the difficulties in a series of related comments](https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704633).

### Windows

Installation on Windows should be completely handled with auto-linking when using React Native Windows 0.63+. For earlier versions, you must [manually link](https://microsoft.github.io/react-native-windows/docs/native-modules-using) the native module.

## How can I take advantage of that?

Screens are already integrated with the React Native's most popular navigation library [react-navigation](https://github.com/react-navigation/react-navigation) and [Expo](https://expo.io).

## Supported react-native version

| version | react-native version |
| ------- | -------------------- |
| 3.0.0+  | 0.62.0+              |
| 2.0.0+  | 0.60.0+              |

## Usage with [react-navigation](https://github.com/react-navigation/react-navigation)

Screens support is built into [react-navigation](https://github.com/react-navigation/react-navigation) starting from version [2.14.0](https://github.com/react-navigation/react-navigation/releases/tag/2.14.0) for all the different navigator types (stack, tab, drawer, etc).

To configure react-navigation to use screens instead of plain RN Views for rendering screen views, simply add this library as a dependency to your project:

```bash
# bare React Native project
yarn add react-native-screens

# if you use Expo managed workflow
expo install react-native-screens
```

Just make sure that the version of [react-navigation](https://github.com/react-navigation/react-navigation) you are using is 2.14.0 or higher.

You are all set 🎉 – when screens are enabled in your application code react-navigation will automatically use them instead of relying on plain React Native Views.

### Disabling `react-native-screens`

If, for whatever reason, you'd like to disable native screens support and use plain React Native Views add the following code in your entry file (e.g. `App.js`):

```js
import { enableScreens } from 'react-native-screens';

enableScreens(false);
```

You can also disable the usage of native screens per navigator with [`detachInactiveScreens`](https://reactnavigation.org/docs/stack-navigator#detachinactivescreens).

### Using `createNativeStackNavigator` with React Navigation

To take advantage of the native stack navigator primitive for React Navigation that leverages `UINavigationController` on iOS and `Fragment` on Android, please refer:
- for React Navigation >= v6 to the [Native Stack Navigator part of React Navigation documentation](https://reactnavigation.org/docs/native-stack-navigator)
- for React Navigation v5 to the [README in react-native-screens/native-stack](https://github.com/software-mansion/react-native-screens/tree/master/native-stack) 
- for older versions to the [README in react-native-screens/createNativeStackNavigator](https://github.com/software-mansion/react-native-screens/tree/master/createNativeStackNavigator) 

## Interop with [react-native-navigation](https://github.com/wix/react-native-navigation)

React-native-navigation library already uses native containers for rendering navigation scenes so wrapping these scenes with `<ScreenContainer>` or `<Screen>` component does not provide any benefits. Yet if you would like to build a component that uses screens primitives under the hood (for example a view pager component) it is safe to use `<ScreenContainer>` and `<Screen>` components for that as these work out of the box when rendered on react-native-navigation scenes.

## Interop with other libraries

This library should work out of the box with all existing react-native libraries. If you experience problems with interoperability please [report an issue](https://github.com/kmagiera/react-native-screens/issues).

## Guide for navigation library authors

If you are building a navigation library you may want to use `react-native-screens` to have control over which parts of the React component tree are attached to the native view hierarchy.
To do that, `react-native-screens` provides you with the components documented [here](https://github.com/kmagiera/react-native-screens/tree/master/guides/GUIDE_FOR_LIBRARY_AUTHORS.md).

## Contributing

There are many ways to contribute to this project. See [CONTRIBUTING](https://github.com/kmagiera/react-native-screens/tree/master/guides/CONTRIBUTING.md) guide for more information. Thank you for your interest in contributing!

## License

React native screens library is licensed under [The MIT License](LICENSE).

## Credits

This project is supported by amazing people from [Expo.io](https://expo.io) and [Software Mansion](https://swmansion.com)

[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 'Expo.io')](https://expo.io)
[![swm](https://logo.swmansion.com/logo?color=white&variant=desktop&width=150&tag=react-native-screens-github 'Software Mansion')](https://swmansion.com)
