# Guide for navigation library authors

If you are building a navigation library you may want to use react-native-screens to have control over which parts of the React component tree are attached to the native view hierarchy.
To do that react-native-screens provides you with two components documented below:

## `<ScreenContainer/>`

This component is a container for one or more `Screen` components.
It does not accept other component types as direct children.
The role of the container is to control which of its children's screens should be attached to the view hierarchy.
It does that by monitoring the `activityState` property of each of its children.
It is possible to have as many active children as you'd like but for the component to be the most efficient, we should keep the number of active screens to a minimum.
In the case of a stack navigator or tabs navigator, we only want to have one active screen (the topmost view on a stack or the selected tab).
While transitioning between views we may want to activate a second screen for the duration of the transition, and then go back to just one active screen.

## `<Screen/>`

This component is a container for views we want to display on a navigation screen.
It is designed to only be rendered as a direct child of `ScreenContainer`.
In addition to plain React Native [View props](http://facebook.github.io/react-native/docs/view#props) this component only accepts a single additional property called `activityState`.
When `activityState` is set to `0`, the parent container will detach its views from the native view hierarchy. When `activityState` is set to `1`, the `Screen` will stay attached, but on iOS it will not respond to touches. We only want to set `activityState` to `1` for during the transition or e.g. for modal presentation, where the previous screen should be visible, but not interactive. When `activityState` is set to `2`, the views will be attached and will respond to touches as long as the parent container is attached too. When one of the `Screen` components get the `activityState` value set to `2`, we interpret it as the end of the transition.

### Example

```js
<ScreenContainer>
  <Screen>{tab1}</Screen>
  <Screen activityState={2}>{tab2}</Screen>
  <Screen>{tab3}</Screen>
</ScreenContainer>
```

## `<ScreenStack>`

Screen stack component expects one or more `Screen` components as direct children and renders them in a platform-native stack container (for iOS it is `UINavigationController` and for Android inside `Fragment` container). For `Screen` components placed as children of `ScreenStack` the `activityState` property is ignored and instead the screen that corresponds to the last child is rendered as active. All types of updates done to the list of children are acceptable when the top element is exchanged the container will use platform default (unless customized) animation to transition between screens.

Below is the list of additional properties that can be used for `Screen` component:

### `customAnimationOnSwipe` (iOS only)

Boolean indicating that swipe dismissal should trigger animation provided by `stackAnimation`. Defaults to `false`.

### freezeOnBlur

Whether inactive screens should be suspended from re-rendering.

Defaults to `false`. When `enableFreeze()` is run at the top of the application defaults to `true`.

### `fullScreenSwipeEnabled` (iOS only)

Boolean indicating whether the swipe gesture should work on whole screen. Swiping with this option results in the same transition animation as `simple_push` by default. It can be changed to other custom animations with `customAnimationOnSwipe` prop, but default iOS swipe animation is not achievable due to usage of custom recognizer. Defaults to `false`.

### `gestureEnabled` (iOS only)

When set to `false` the back swipe gesture will be disabled. The default value is `true`.

#### `gestureResponseDistance` (iOS only)

Use it to restrict the distance from the edges of screen in which the gesture should be recognized. To be used alongside `fullScreenSwipeEnabled`. The responsive area is covered with 4 values: `start`, `end`, `top`, `bottom`. Example usage:

```tsx
gestureResponseDistance: {
  start: 200,
  end: 250,
  top: 100,
  bottom: 150,
}
```

### `hideKeyboardOnSwipe` (iOS only)

Whether the keyboard should hide when swiping to the previous screen. Defaults to `false`.

### `homeIndicatorHidden` (iOS only)

Whether the home indicator should be hidden on this screen. Defaults to `false`.

### `nativeBackButtonDismissalEnabled` (Android only)

Boolean indicating whether, when the Android default back button is clicked, the `pop` action should be performed on the native side or on the JS side to be able to prevent it.
Unfortunately the same behavior is not available on iOS since the behavior of native back button cannot be changed there.

Defaults to `false`.

### `navigationBarColor` (Android only)

Sets the navigation bar color. Defaults to initial status bar color.

### `navigationBarHidden` (Android only)

Sets the visibility of the navigation bar. Defaults to `false`.

### `onAppear`

A callback that gets called when the current screen appears.

### `onDisappear`

A callback that gets called when the current screen disappears.

### `onDismissed`

A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down). The callback takes no arguments.

### `onHeaderBackButtonClicked` (Android only)

A callback that gets called when the native header back button is clicked on Android and `enableNativeBackButtonDismissal` is set to `false`.

### `onNativeDismissCancelled` (iOS only)

An internal callback called when screen is dismissed by gesture or by native header back button and `preventNativeDismiss` is set to `true`.

### `onWillAppear`

A callback that gets called when the current screen will appear. This is called as soon as the transition begins.

### `onWillDisappear`

A callback that gets called when the current screen will disappear. This is called as soon as the transition begins.

### `preventNativeDismiss` (iOS only)

Boolean indicating whether to prevent current screen from being dismissed. Defaults to `false`.

### `replaceAnimation`

Allows for the customization of the type of animation to use when this screen replaces another screen at the top of the stack. The following values are currently supported:

- `push` – performs push animation
- `pop` – performs pop animation (default)

### `screenOrientation`

Sets the current screen's available orientations and forces rotation if current orientation is not included. On iOS, if you have supported orientations set in `info.plist`, they will take precedence over this prop. Possible values:

- `default` - on iOS, it resolves to [UIInterfaceOrientationMaskAllButUpsideDown](https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask/uiinterfaceorientationmaskallbutupsidedown?language=objc). On Android, this lets the system decide the best orientation.
- `all`
- `portrait`
- `portrait_up`
- `portrait_down`
- `landscape`
- `landscape_left`
- `landscape_right`

Defaults to `default` on iOS.

### `stackAnimation`

Allows for the customization of how the given screen should appear/disappear when pushed or popped at the top of the stack. The following values are currently supported:

- `"default"` – uses a platform default animation
- `"fade"` – fades screen in or out
- `fade_from_bottom` – performs a fade from bottom animation
- `"flip"` – flips the screen, requires `stackPresentation: "modal"` (iOS only)
- `"simple_push"` – performs a default animation, but without shadow and native header transition (iOS only)
- `"slide_from_bottom"` - slide in the new screen from bottom to top
- `"slide_from_right"` - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
- `"slide_from_left"` - slide in the new screen from left to right (Android only, resolves to default transition on iOS)
- `"none"` – the screen appears/disappears without an animation

### `stackPresentation`

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

### `statusBarAnimation`

Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Possible values: `fade`, `none`, `slide`. On Android, this prop considers the transition of changing status bar color (see https://reactnative.dev/docs/statusbar#animated). There will be no animation if `none` provided.

Defaults to `fade` on iOS and `none` on Android.

### `statusBarColor` (Android only)

Sets the status bar color (similar to the `StatusBar` component). Defaults to initial status bar color.

### `statusBarHidden`

When set to true, the status bar for this screen is hidden. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.

Defaults to `false`.

### `statusBarStyle`

Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. On iOS, the possible values are: `auto` (based on [user interface style](https://developer.apple.com/documentation/uikit/uiuserinterfacestyle?language=objc), `inverted` (colors opposite to `auto`), `light`, `dark`. On Android, the status bar will be dark if set to `dark` and `light` otherwise.

Defaults to `auto`.

### `statusBarTranslucent` (Android only)

Sets the translucency of the status bar (similar to the `StatusBar` component). Defaults to `false`.

### `swipeDirection` (iOS only)

Sets the direction in which you should swipe to dismiss the screen. The following values are supported:

- `vertical` – dismiss screen vertically
- `horizontal` – dismiss screen horizontally (default)

When using `vertical` option, options `fullScreenSwipeEnabled: true`, `customAnimationOnSwipe: true` and `stackAnimation: 'slide_from_bottom'` are set by default.

### `transitionDuration` (iOS only)

Changes the duration (in milliseconds) of `slide_from_bottom`, `fade_from_bottom`, `fade` and `simple_push` transitions on iOS. Defaults to `350`.

The duration of `default` and `flip` transitions isn't customizable.

### `useTransitionProgress`

Hook providing context value of transition progress of the current screen to be used with `react-native` `Animated`. It consists of 2 values:

- `progress` - `Animated.Value` between `0.0` and `1.0` with the progress of the current transition.
- `closing` - `Animated.Value` of `1` or `0` indicating if the current screen is being navigated into or from.
- `goingForward` - `Animated.Value` of `1` or `0` indicating if the current transition is pushing or removing screens.

```jsx
import { Animated } from 'react-native';
import { useTransitionProgress } from 'react-native-screens';

function Home() {
  const { progress } = useTransitionProgress();

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0, 1.0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{ opacity, height: 50, width: '100%', backgroundColor: 'green' }}
    />
  );
}
```

### `useReanimatedTransitionProgress`

A callback called every frame during the transition of screens to be used with `react-native-reanimated` version `2.x`. It consists of 2 shared values:

- `progress` - between `0.0` and `1.0` with the progress of the current transition.
- `closing` - `1` or `0` indicating if the current screen is being navigated into or from.
- `goingForward` - `1` or `0` indicating if the current transition is pushing or removing screens.

In order to use it, you need to have `react-native-reanimated` version `2.x` installed in your project and wrap your code with `ReanimatedScreenProvider`, like this:

```jsx
import { ReanimatedScreenProvider } from 'react-native-screens/reanimated';

export default function App() {
  return (
    <ReanimatedScreenProvider>
      <YourApp />
    </ReanimatedScreenProvider>
  );
}
```

Then you can use `useReanimatedTransitionProgress` to get the shared values:

```jsx
import { useReanimatedTransitionProgress } from 'react-native-screens/reanimated';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

function Home() {
  const reaProgress = useReanimatedTransitionProgress();
  const sv = useDerivedValue(
    () =>
      (reaProgress.progress.value < 0.5
        ? reaProgress.progress.value * 50
        : (1 - reaProgress.progress.value) * 50) + 50
  );
  const reaStyle = useAnimatedStyle(() => {
    return {
      width: sv.value,
      height: sv.value,
      backgroundColor: 'blue',
    };
  });

  return <Animated.View style={reaStyle} />;
}
```

## `<ScreenStackHeaderConfig>`

The config component is expected to be rendered as a direct child of `<Screen>`. It provides an ability to configure native navigation header that gets rendered as a part of the native screen stack. The component acts as a "virtual" element that is not directly rendered under `Screen`. You can use its properties to customize platform native header for the parent screen and also render react-native components that you'd like to be displayed inside the header (e.g. in the title are or on the side).

Along with this component's properties that can be used to customize header behavior, one can also use one of the below component containers to render custom react-native content in different areas of the native header:

- `ScreenStackHeaderCenterView` – the children will render in the center of the native navigation bar.
- `ScreenStackHeaderRightView` – the children will render on the right-hand side of the navigation bar (or on the left-hand side in case LTR locales are set on the user's device).
- `ScreenStackHeaderLeftView` – the children will render on the left-hand side of the navigation bar (or on the right-hand side in case LTR locales are set on the user's device).
- `ScreenStackHeaderSearchBarView` - used for rendering `<SearchBar>` component. It will appear in the bottom of the native navigation bar on iOS and as search icon on Android.

To render a search bar use `ScreenStackHeaderSearchBarView` with `<SearchBar>` component provided as a child. `<SearchBar>` component that comes from react-native-screens supports various properties:

- `autoCapitalize` - Controls whether the text is automatically auto-capitalized as it is entered by the user. Can be one of these: `none`, `words`, `sentences`, `characters`. Defaults to `sentences` on iOS and `'none'` on Android.
- `autoFocus` - If `true` automatically focuses search bar when screen is appearing. (Android only)
- `barTintColor` - The search field background color. By default bar tint color is translucent.
- `tintColor` - The color for the cursor caret and cancel button text. (iOS only)
- `cancelButtonText` - The text to be used instead of default `Cancel` button text. (iOS only)
- `disableBackButtonOverride` - Default behavior is to prevent screen from going back when search bar is open (`disableBackButtonOverride: false`). If you don't want this to happen set `disableBackButtonOverride` to `true`. (Android only)
- `hideNavigationBar` - Boolean indicating whether to hide the navigation bar during searching. Defaults to `true`. (iOS only)
- `hideWhenScrolling` - Boolean indicating whether to hide the search bar when scrolling. Defaults to `true`. (iOS only)
- `inputType` - Specifies type of input and keyboard for search bar. Can be one of `'text'`, `'phone'`, `'number'`, `'email'`. Defaults to `'text'`. (Android only)
- `obscureBackground` - Boolean indicating whether to obscure the underlying content with semi-transparent overlay. Defaults to `true`. (iOS only)
- `onBlur` - A callback that gets called when search bar has lost focus.
- `onChangeText` - A callback that gets called when the text changes. It receives the current text value of the search bar.
- `onCancelButtonPress` - A callback that gets called when the cancel button is pressed.
- `onClose` - A callback that gets called when search bar is closing. (Android only)
- `onFocus` - A callback that gets called when search bar has received focus.
- `onOpen` - A callback that gets called when search bar is expanding. (Android only)
- `onSearchButtonPress` - A callback that gets called when the search button is pressed. It receives the current text value of the search bar.
- `placeholder` - Text displayed when search field is empty. Defaults to an empty string.
- `textColor` - The search field text color.
- `hintTextColor` - The search hint text color. (Android only)
- `headerIconColor` - The search and close icon color shown in the header. (Android only)
- `shouldShowHintSearchIcon` - Show the search hint icon when search bar is focused. (Android only)
- `ref` - A React ref to imperatively modify search bar.

Allowed imperative actions on search bar are:

- `focus` - Function to focus on search bar. (iOS only)
- `blur` - Function to remove focus from search bar. (iOS only)
- `clearText` - Function to clear text in search bar. (iOS only)
- `toggleCancelButton` - Function toggle cancel button display near search bar. (iOS only)

Below is a list of properties that can be set with `ScreenStackHeaderConfig` component:

### `backButtonInCustomView`

Whether to show the back button with a custom left side of the header.

### `backgroundColor`

Controls the color of the navigation header.

### `backTitle` (iOS only)

Allows for controlling the string to be rendered next to back button. By default iOS uses the title of the previous screen.

### `backTitleFontFamily` (iOS only)

Allows for customizing font family to be used for back button title on iOS.

### `backTitleFontSize` (iOS only)

Allows for customizing font size to be used for back button title on iOS.

### `blurEffect` (iOS only)

Blur effect to be applied to the header. Works with `backgroundColor`'s alpha < 1.

### `children`

Pass `ScreenStackHeaderBackButtonImage`, `ScreenStackHeaderRightView`, `ScreenStackHeaderLeftView`, `ScreenStackHeaderCenterView`, `ScreenStackHeaderSearchBarView`.

### `direction`

Controls whether the stack should be in `rtl` or `ltr` form.

### `disableBackButtonMenu` (iOS only)

Boolean indicating whether to show the menu on longPress of iOS >= 14 back button.

### `hidden`

When set to `true` the header will be hidden while the parent `Screen` is on the top of the stack. The default value is `false`.

### `color`

Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color, use `titleColor` property.

### `hideBackButton`

If set to `true` the back button will not be rendered as a part of navigation header.

### `hideShadow`

Boolean that allows for disabling drop shadow under navigation header. The default value is `true`.

### `largeTitle` (iOS only)

When set to `true`, it makes the title display using the large title effect.

### `titleColor`

Controls the color of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.

### `largeTitleColor` (iOS only)

Customize the color to be used for the large title. By default uses the `titleColor` property.

### `largeTitleFontFamily` (iOS only)

Customize font family to be used for the large title.

### `largeTitleFontSize` (iOS only)

Customize the size of the font to be used for the large title.

### `largeTitleFontWeight` (iOS only)

Customize the weight of the font to be used for the large title.

### `largeTitleHideShadow` (iOS only)

Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.

### `title`

String representing screen title that will get rendered in the middle section of the header. On iOS the title is centered on the header while on Android it is aligned to the left and placed next to back button (if one is present).

### `titleColor`

Customize text color of the title.

### `titleFontFamily`

Customize font family to be used for the title.

### `titleFontSize`

Customize the size of the font to be used for the title.

### `titleFontWeight`

Customize the weight of the font to be used for the title.

### `topInsetEnabled` (Android only)

A flag to that lets you opt out of insetting the header. You may want to set this to `false` if you use an opaque status bar. Defaults to `true`.

### `translucent`

When set to true, it makes native navigation bar semi transparent. It adds blur effect on iOS. The default value is false.

# Guide for native component authors

If you are adding a new native component to be used from the React Native app, you may want it to respond to navigation lifecycle events.

A good example is a map component that shows the current user location. When the component is on the top-most screen, it should register for location updates and display the user's location on the map. But if we navigate away from a screen that has a map, e.g. by pushing a new screen on top of it or if it is in one of the tabs, and the user just switched to the previous app, we may want to stop listening to location updates.

To achieve that, we need to know at the native component level when our native view goes out of sight. With `react-native-screens`, you can do that in the following way:

## Navigation lifecycle on iOS

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

You can check our example app for a fully functional demo see [RNSSampleLifecycleAwareView.m](https://github.com/software-mansion/react-native-screens/blob/main/Example/ios/ScreensExample/RNSSampleLifecycleAwareView.m) for more details.

## Navigation lifecycle on Android

On Android, you can use [LifecycleObserver](https://developer.android.com/reference/android/arch/lifecycle/LifecycleObserver) interface which is a part of Android compat library to make your view handle lifecycle events.
Check [LifecycleAwareView.java](https://github.com/software-mansion/react-native-screens/blob/main/Example/android/app/src/main/java/com/swmansion/rnscreens/example/LifecycleAwareView.java) from our example app for more details on that.

In addition to that, you will need to register for receiving these updates. This can be done using [`LifecycleHelper.register`](https://github.com/software-mansion/react-native-screens/blob/main/android/src/main/java/com/swmansion/rnscreens/LifecycleHelper.java#L50).
Remember to call [`LifecycleHelper.unregister`](https://github.com/software-mansion/react-native-screens/blob/main/android/src/main/java/com/swmansion/rnscreens/LifecycleHelper.java#L59) before the view is dropped.
Please refer to [SampleLifecycleAwareViewManager.java](https://github.com/software-mansion/react-native-screens/blob/main/Example/android/app/src/main/java/com/swmansion/rnscreens/example/SampleLifecycleAwareViewManager.java) from our example app to see what are the best ways of using the above methods.

## Android hardware back button

In order to properly handle the hardware back button on Android, you should implement the navigation logic concerning it. You can see an example of how it is done in `react-navigation` here: https://github.com/react-navigation/react-navigation/blob/6cba517b74f5fd092db21d5574b558ef2d80897b/packages/native/src/useBackButton.tsx.
