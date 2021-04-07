# react-native-screens

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

## How can I take advantage of that?

Screens are already integrated with the React Native's most popular navigation library [react-navigation](https://github.com/react-navigation/react-navigation) and [Expo](https://expo.io).
Read usage guide depending on if you are [using Expo](#usage-in-expo-with-react-navigation) or [not](#usage-with-react-navigation-without-expo).

## Supported react-native version

| version | react-native version |
| ------- | -------------------- |
| 3.0.0+  | 0.62.0+              |
| 2.0.0+  | 0.60.0+              |

## Usage with [react-navigation](https://github.com/react-navigation/react-navigation)

Screens support is built into [react-navigation](https://github.com/react-navigation/react-navigation) starting from version [2.14.0](https://github.com/react-navigation/react-navigation/releases/tag/2.14.0) for all the different navigator types (stack, tab, drawer, etc). We plan on adding it to other navigators shortly.

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

### Using createNativeStackNavigator with React Navigation

To take advantage of the native stack navigator primitive for React Navigation that leverages `UINavigationController` on iOS and `Fragment` on Android, please refer to the [README in react-native-screens/native-stack](https://github.com/software-mansion/react-native-screens/tree/master/native-stack) for React Navigation v5 and [README in react-native-screens/createNativeStackNavigator](https://github.com/software-mansion/react-native-screens/tree/master/createNativeStackNavigator) for older versions. 

## Interop with [react-native-navigation](https://github.com/wix/react-native-navigation)

React-native-navigation library already uses native containers for rendering navigation scenes so wrapping these scenes with `<ScreenContainer>` or `<Screen>` component does not provide any benefits. Yet if you would like to build a component that uses screens primitives under the hood (for example a view pager component) it is safe to use `<ScreenContainer>` and `<Screen>` components for that as these work out of the box when rendered on react-native-navigation scenes.

## Interop with other libraries

This library should work out of the box with all existing react-native libraries. If you experience problems with interoperability please [report an issue](https://github.com/kmagiera/react-native-screens/issues).

## Guide for navigation library authors

If you are building a navigation library you may want to use react-native-screens to have control over which parts of the React component tree are attached to the native view hierarchy.
To do that react-native-screens provides you with two components documented below:

### `<ScreenContainer/>`

This component is a container for one or more `Screen` components.
It does not accept other component types as direct children.
The role of the container is to control which of its children's screens should be attached to the view hierarchy.
It does that by monitoring the `activityState` property of each of its children.
It is possible to have as many active children as you'd like but for the component to be the most efficient, we should keep the number of active screens to a minimum.
In the case of a stack navigator or tabs navigator, we only want to have one active screen (the topmost view on a stack or the selected tab).
While transitioning between views we may want to activate a second screen for the duration of the transition, and then go back to just one active screen.

### `<Screen/>`

This component is a container for views we want to display on a navigation screen.
It is designed to only be rendered as a direct child of `ScreenContainer`.
In addition to plain React Native [View props](http://facebook.github.io/react-native/docs/view#props) this component only accepts a single additional property called `activityState`.
When `activityState` is set to `0`, the parent container will detach its views from the native view hierarchy. When `activityState` is set to `1`, the `Screen` will stay attached, but on iOS it will not respond to touches. We only want to set `activityState` to `1` for during the transition or e.g. for modal presentation, where the previous screen should be visible, but not interactive. When `activityState` is set to `2`, the views will be attached and will respond to touches as long as the parent container is attached too. When one of the `Screen` components get the `activityState` value set to `2`, we interpret it as the end of the transition.

#### Example

```js
<ScreenContainer>
  <Screen>{tab1}</Screen>
  <Screen activityState={2}>{tab2}</Screen>
  <Screen>{tab3}</Screen>
</ScreenContainer>
```

### `<ScreenStack>`

Screen stack component expects one or more `Screen` components as direct children and renders them in a platform-native stack container (for iOS it is `UINavigationController` and for Android inside `Fragment` container). For `Screen` components placed as children of `ScreenStack` the `activityState` property is ignored and instead the screen that corresponds to the last child is rendered as active. All types of updates done to the list of children are acceptable when the top element is exchanged the container will use platform default (unless customized) animation to transition between screens.

Below is the list of additional properties that can be used for `Screen` component:

#### `gestureEnabled` (iOS only)

When set to `false` the back swipe gesture will be disabled. The default value is `true`.

#### `onAppear`

A callback that gets called when the current screen appears.

#### `onDisappear`

A callback that gets called when the current screen disappears.

#### `onDismissed`

A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down). The callback takes no arguments.

#### `onWillAppear`

A callback that gets called when the current screen will appear. This is called as soon as the transition begins.

#### `onWillDisappear`

A callback that gets called when the current screen will disappear. This is called as soon as the transition begins.

#### `replaceAnimation`

Allows for the customization of the type of animation to use when this screen replaces another screen at the top of the stack. The following values are currently supported:
- `push` – performs push animation
- `pop` – performs pop animation (default)

#### `stackAnimation`

Allows for the customization of how the given screen should appear/disappear when pushed or popped at the top of the stack. The following values are currently supported:

- `"default"` – uses a platform default animation
- `"fade"` – fades screen in or out
- `"flip"` – flips the screen, requires `stackPresentation: "modal"` (iOS only)
- `"slide_from_right"` - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
- `"slide_from_left"` - slide in the new screen from left to right (Android only, resolves to default transition on iOS)
- `"none"` – the screen appears/disappears without an animation

#### `stackPresentation`

Defines how the method that should be used to present the given screen. It is a separate property from `stackAnimation` as the presentation mode can carry additional semantic. The allowed values are:

- `push` – the new screen will be pushed onto a stack which on iOS means that the default animation will be slide from the side, the animation on Android may vary depending on the OS version and theme.
- `modal` – Explained below.
- `transparentModal` – Explained below.
- `containedModal` – Explained below.
- `containedTransparentModal` – Explained below.
- `fullScreenModal` – Explained below.
- `formSheet` – Explained below.

Using `containedModal` and `containedTransparentModal` with other types of modals in one native stack navigator is not recommended and can result in a freeze or a crash of the application.

For iOS:
- `modal` will use [`UIModalPresentationAutomatic`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationautomatic?language=objc) on iOS 13 and later, and will use [`UIModalPresentationFullScreen`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationfullscreen?language=objc) on iOS 12 and earlier.
- `fullScreenModal` will use [`UIModalPresentationFullScreen`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationfullscreen?language=objc)
- `formSheet` will use [`UIModalPresentationFormSheet`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationformsheet?language=objc)
- `transparentModal` will use [`UIModalPresentationOverFullScreen`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationoverfullscreen?language=objc)
- `containedModal` will use [`UIModalPresentationCurrentContext`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationcurrentcontext?language=objc)
- `containedTransparentModal` will use [`UIModalPresentationOverCurrentContext`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationovercurrentcontext?language=objc)

For Android:

`modal`, `containedModal`, `fullScreenModal`, `formSheet` will use `Screen.StackPresentation.MODAL`.

`transparentModal`, `containedTransparentModal` will use `Screen.StackPresentation.TRANSPARENT_MODAL`.

### `<ScreenStackHeaderConfig>`

The config component is expected to be rendered as a direct child of `<Screen>`. It provides an ability to configure native navigation header that gets rendered as a part of the native screen stack. The component acts as a "virtual" element that is not directly rendered under `Screen`. You can use its properties to customize platform native header for the parent screen and also render react-native components that you'd like to be displayed inside the header (e.g. in the title are or on the side).

Along with this component's properties that can be used to customize header behavior, one can also use one of the below component containers to render custom react-native content in different areas of the native header:

- `ScreenStackHeaderCenterView` – the children will render in the center of the native navigation bar.
- `ScreenStackHeaderRightView` – the children will render on the right-hand side of the navigation bar (or on the left-hand side in case LTR locales are set on the user's device).
- `ScreenStackHeaderLeftView` – the children will render on the left-hand side of the navigation bar (or on the right-hand side in case LTR locales are set on the user's device).

Below is a list of properties that can be set with `ScreenStackHeaderConfig` component:


#### `backButtonInCustomView`

Whether to show the back button with a custom left side of the header.

#### `backgroundColor`

Controls the color of the navigation header.

#### `backTitle` (iOS only)

Allows for controlling the string to be rendered next to back button. By default iOS uses the title of the previous screen.

#### `backTitleFontFamily` (iOS only)

Allows for customizing font family to be used for back button title on iOS.

#### `backTitleFontSize` (iOS only)

Allows for customizing font size to be used for back button title on iOS.

#### `blurEffect` (iOS only)

Blur effect to be applied to the header. Works with `backgroundColor`'s alpha < 1.

#### `children`

Pass `ScreenStackHeaderBackButtonImage`, `ScreenStackHeaderRightView`, `ScreenStackHeaderLeftView`, `ScreenStackHeaderCenterView`.

#### `direction`

Controls whether the stack should be in `rtl` or `ltr` form.

#### `hidden`

When set to `true` the header will be hidden while the parent `Screen` is on the top of the stack. The default value is `false`.

#### `color`

Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color, use `titleColor` property.

#### `hideBackButton`

If set to `true` the back button will not be rendered as a part of navigation header.

#### `hideShadow`

Boolean that allows for disabling drop shadow under navigation header. The default value is `true`.

#### `largeTitle` (iOS only)

When set to `true`, it makes the title display using the large title effect.

#### `titleColor`

Controls the color of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.

#### `largeTitleColor` (iOS only)

Customize the color to be used for the large title. By default uses the `titleColor` property.

#### `largeTitleFontFamily` (iOS only)

Customize font family to be used for the large title.

#### `largeTitleFontSize` (iOS only)

Customize the size of the font to be used for the large title.

#### `largeTitleFontWeight` (iOS only)

Customize the weight of the font to be used for the large title.

#### `largeTitleHideShadow` (iOS only)

Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.

#### `screenOrientation`

Sets the current screen's available orientations and forces rotation if current orientation is not included. Possible values:

- `default` - on iOS, it resolves to [UIInterfaceOrientationMaskAllButUpsideDown](https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask/uiinterfaceorientationmaskallbutupsidedown?language=objc). On Android, this lets the system decide the best orientation.
- `all`
- `portrait`
- `portrait_up`
- `portrait_down`
- `landscape`
- `landscape_left`
- `landscape_right`

Defaults to `default`.

#### `statusBarAnimation` (iOS only)

Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Defaults to `fade`.

#### `statusBarHidden` (iOS only)

When set to true, the status bar for this screen is hidden. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Defaults to `false`.

#### `statusBarStyle` (iOS only)

Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Defaults to `auto`.

#### `title`

String representing screen title that will get rendered in the middle section of the header. On iOS the title is centered on the header while on Android it is aligned to the left and placed next to back button (if one is present).

#### `titleColor`

Customize text color of the title.

#### `titleFontFamily`

Customize font family to be used for the title.

#### `titleFontSize`

Customize the size of the font to be used for the title.

#### `titleFontWeight`

Customize the weight of the font to be used for the title.

#### `topInsetEnabled` (Android only)

A flag to that lets you opt out of insetting the header. You may want to set this to `false` if you use an opaque status bar. Defaults to `true`.

#### `translucent`

When set to true, it makes native navigation bar semi transparent. It adds blur effect on iOS. The default value is false.

## Guide for native component authors

If you are adding a new native component to be used from the React Native app, you may want it to respond to navigation lifecycle events.

A good example is a map component that shows the current user location. When the component is on the top-most screen, it should register for location updates and display the user's location on the map. But if we navigate away from a screen that has a map, e.g. by pushing a new screen on top of it or if it is in one of the tabs, and the user just switched to the previous app, we may want to stop listening to location updates.

To achieve that, we need to know at the native component level when our native view goes out of sight. With `react-native-screens`, you can do that in the following way:

### Navigation lifecycle on iOS

In order for your native view on iOS to be notified when its parent navigation container goes into background, override `didMoveToWindow` method:

```objective-c
- (void)didMoveToWindow
{
  [super didMoveToWindow];
  BOOL isVisible = self.superview && self.window;
  if (isVisible) {
    // navigation container this view belongs to became visible
  } else {
    // we are in a background
  }
}
```

You can check our example app for a fully functional demo see [RNSSampleLifecycleAwareView.m](https://github.com/kmagiera/react-native-screens/blob/master/Example/ios/ScreensExample/RNSSampleLifecycleAwareView.m) for more details.

### Navigation lifecycle on Android

On Android, you can use [LifecycleObserver](https://developer.android.com/reference/android/arch/lifecycle/LifecycleObserver) interface which is a part of Android compat library to make your view handle lifecycle events.
Check [LifecycleAwareView.java](https://github.com/kmagiera/react-native-screens/blob/master/Example/android/app/src/main/java/com/swmansion/rnscreens/example/LifecycleAwareView.java) from our example app for more details on that.

In addition to that, you will need to register for receiving these updates. This can be done using [`LifecycleHelper.register`](https://github.com/kmagiera/react-native-screens/blob/master/android/src/main/java/com/swmansion/rnscreens/LifecycleHelper.java#L50).
Remember to call [`LifecycleHelper.unregister`](https://github.com/kmagiera/react-native-screens/blob/master/android/src/main/java/com/swmansion/rnscreens/LifecycleHelper.java#L59) before the view is dropped.
Please refer to [SampleLifecycleAwareViewManager.java](https://github.com/kmagiera/react-native-screens/blob/master/Example/android/app/src/main/java/com/swmansion/rnscreens/example/SampleLifecycleAwareViewManager.java) from our example app to see what are the best ways of using the above methods.

## License

React native screens library is licensed under [The MIT License](LICENSE).

## Credits

This project is supported by amazing people from [Expo.io](https://expo.io) and [Software Mansion](https://swmansion.com)

[![expo](https://avatars2.githubusercontent.com/u/12504344?v=3&s=100 'Expo.io')](https://expo.io)
[![swm](https://logo.swmansion.com/logo?color=white&variant=desktop&width=150&tag=react-native-screens-github 'Software Mansion')](https://swmansion.com)
