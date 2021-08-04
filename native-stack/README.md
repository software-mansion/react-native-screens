# Native Stack Navigator

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS, the stack navigator can also be configured to a modal style where screens slide in from the bottom.

This navigator uses native navigation primitives (`UINavigationController` on iOS and `Fragment` on Android) for navigation under the hood. The main difference from React Navigation's JS-based [stack navigator](https://reactnavigation.org/docs/stack-navigator.html) is that the JS-based navigator re-implements animations and gestures while the native stack navigator relies on the platform primitives for animations and gestures. You should use this navigator if you want native feeling and performance for navigation and don't need much customization, as the customization options of this navigator are limited.

```sh
npm install react-native-screens @react-navigation/native
```

## Disabling `react-native-screens`

If, for whatever reason, you'd like to disable native screens support and use plain React Native Views add the following code in your entry file (e.g. `App.js`):

```js
import { enableScreens } from 'react-native-screens';

enableScreens(false);
```

## API Definition

To use this navigator, import it from `react-native-screens/native-stack`:

```js
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
```

### Props

The `Stack.Navigator` component accepts following props:

#### `initialRouteName`

The name of the route to render on the first load of the navigator.

#### `screenOptions`

Default options to use for the screens in the navigator.

### Options

The `options` prop can be used to configure individual screens inside the navigator. Supported options are:

#### `backButtonInCustomView`

Boolean indicating whether to hide the back button while using `headerLeft` function.

#### `contentStyle`

Style object for the scene content.

#### `direction`

String that applies `rtl` or `ltr` form to the stack. On Android, you have to add `android:supportsRtl="true"` in the manifest of your app to enable `rtl`. On Android, if you set the above flag in the manifest, the orientation changes without the need to do it programmatically if the phone has `rtl` direction enabled. On iOS, the direction defaults to `ltr`, and only way to change it is via this prop.

#### `disableBackButtonMenu`

Boolean indicating whether to show the menu on longPress of iOS >= 14 back button. Only supported on iOS.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true`,

Gestures are only supported on iOS.

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's `headerTitle`.

#### `headerBackTitleStyle`

Style object for header back title. Supported properties:

- `fontFamily`
- `fontSize`

#### `headerBackTitleVisible`

Whether the back button title should be visible or not. Defaults to `true`. Only supported on iOS.

#### `headerCenter`

Function which returns a React Element to display in the center of the header.

#### `headerHideBackButton`

Boolean indicating whether to hide the back button in the header.

#### `headerHideShadow`

Boolean indicating whether to hide the elevation shadow on the header.

#### `headerLargeStyle` (iOS only)

Style object for the large header. Supported properties:

- `backgroundColor`

#### `headerLargeTitle`

Boolean used to set a native property to prefer a large title header (like in iOS setting).

For the large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`. If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.

Only supported on iOS.

#### `headerLargeTitleHideShadow` (iOS only)

Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.

#### `headerLargeTitleStyle` (iOS only)

Style object for header large title. Supported properties:

- `fontFamily`
- `fontSize`
- `color`

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. For now, on Android, using it will cause the title to also disappear.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default. Setting this to `false` hides the header.

#### `headerStyle`

Style object for the header. Supported properties:

- `backgroundColor`
- `blurEffect` (iOS only). Possible values can be checked in `index.d.ts` file.

#### `headerTintColor`

Tint color for the header. Changes the color of the back button and title.

#### `headerTitle`

String to be used by the header as title string. Defaults to scene `title`.

#### `headerTitleStyle`

Style object for header title. Supported properties:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `color`

#### `headerTopInsetEnabled`

A Boolean to that lets you opt out of insetting the header. You may want to * set this to `false` if you use an opaque status bar. Defaults to `true`. Insets are always applied on iOS because the header cannot be opaque. Only supported on Android.

#### `headerTranslucent`

Boolean indicating whether the navigation bar is translucent.

#### `replaceAnimation`

How should the screen replacing another screen animate.
The following values are currently supported:
  - `push` – the new screen will perform push animation.
  - `pop` – the new screen will perform pop animation.

Defaults to `pop`.

#### `stackAnimation`

How the given screen should appear/disappear when pushed or popped at the top of the stack. Possible values:

- `default` - uses a platform default animation
- `fade` - fades screen in or out.
- `fade_from_bottom` – performs a fade from bottom animation
- `flip` – flips the screen, requires stackPresentation: `modal` (iOS only)
- `simple_push` – performs a default animation, but without shadow and native header transition (iOS only)
- `slide_from_bottom` – performs a slide from bottom animation
- `slide_from_right` - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
- `slide_from_left` - slide in the new screen from left to right (Android only, resolves to default transition on iOS)
- `none` - the screen appears/disappears without an animation.

Defaults to `default`.

#### `stackPresentation`

How the screen should be presented. Possible values:

- `push` - The new screen will be pushed onto a stack. The default animation on iOS is to slide from the side. The animation on Android may vary depending on the OS version and theme.
- `modal` - The new screen will be presented modally. In addition, this allows for a nested stack to be rendered inside such screens.
- `transparentModal` - The new screen will be presented modally. In addition, the second to last screen will remain attached to the stack container such that if the top screen is translucent, the content below can still be seen. If `"modal"` is used instead, the below screen gets removed as soon as the transition ends.
- `containedModal` – will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to `"modal"` on Android.
- `containedTransparentModal` – will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to `"transparentModal"` on Android.
- `fullScreenModal` – will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to `"modal"` on Android.
- `formSheet` – will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to `"modal"` on Android.

Defaults to `push`.

Using `containedModal` and `containedTransparentModal` with other types of modals in one native stack navigator is not recommended and can result in a freeze or a crash of the application.

#### `title`

A string that can be used as a fallback for `headerTitle`.

### Status bar and orientation managment

With `native-stack`, the status bar and screen orientation can be managed by `UIViewController` on iOS. On Android, the status bar and screen orientation can be managed by `FragmentActivity`. On iOS, it requires:

1. For status bar managment: enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file (it disables the option to use React Native's `StatusBar` component). 
2. For both status bar and orientation managment: adding `#import <RNScreens/UIViewController+RNScreens.h>` in your project's `AppDelegate.m` (you can see this change applied in the `AppDelegate.m` of `Example` project).

On Android, no additional setup is required, although, you should keep in mind that once you set the orientation or status bar props, `react-native-screens` will manage them on every screen, so you shouldn't use other methods of manipulating them then.
#### `screenOrientation`

Sets the current screen's available orientations and forces rotation if current orientation is not included. On iOS, if you have supported orientations set in `info.plist`, they will take precedence over this prop. Possible values:

- `default` - on iOS, it resolves to [UIInterfaceOrientationMaskAllButUpsideDown](https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask/uiinterfaceorientationmaskallbutupsidedown?language=objc). On Android, this lets the system decide the best orientation.
- `all`
- `portrait`
- `portrait_up`
- `portrait_down`
- `landscape`
- `landscape_left`
- `landscape_right`

Defaults to `default`.

#### `statusBarAnimation`

Sets the status bar animation (similar to the `StatusBar` component). Possible values: `fade`, `none`, `slide`. On Android, this prop considers the transition of changing status bar color (see https://reactnative.dev/docs/statusbar#animated). There will be no animation if `none` provided.

Defaults to `fade` on iOS and `none` on Android.

#### `statusBarColor` (Android only)

Sets the status bar color (similar to the `StatusBar` component). Defaults to initial status bar color.

#### `statusBarHidden`

Boolean saying if the status bar for this screen is hidden.

Defaults to `false`.

#### `statusBarStyle`

Sets the status bar color (similar to the `StatusBar` component). On iOS, the possible values are: `auto` (based on [user interface style](https://developer.apple.com/documentation/uikit/uiuserinterfacestyle?language=objc), `inverted` (colors opposite to `auto`), `light`, `dark`. On Android, the status bar will be dark if set to `dark` and `light` otherwise.

Defaults to `auto`.

#### `statusBarTranslucent` (Android only)

Sets the translucency of the status bar (similar to the `StatusBar` component). Defaults to `false`.

### Search bar (iOS only)

The search bar is just a `searchBar` property that can be specified in the navigator's `screenOptions` or an individual screen's `options`. Search bars are rarely static so normally it is controlled by passing an object to `searchBar` navigation option in the component's body.

Search bar is only supported on iOS.

Example: 

```js
React.useEffect(() => {
  navigation.setOptions({
    searchBar: {
      // search bar options
    }
  });
}, [navigation]);
```

Supported properties are described below.

#### `autoCapitalize`

Controls whether the text is automatically auto-capitalized as it is entered by the user.
Possible values:

- `none`
- `words`
- `sentences`
- `characters`

Defaults to `sentences`.

#### `barTintColor`

The search field background color.

By default bar tint color is translucent.

#### `hideNavigationBar`

Boolean indicating whether to hide the navigation bar during searching.

Defaults to `true`.

#### `hideWhenScrolling`

Boolean indicating whether to hide the search bar when scrolling.

Defaults to `true`.

####  `obscureBackground`

Boolean indicating whether to obscure the underlying content with semi-transparent overlay.

Defaults to `true`.

#### `onBlur`

A callback that gets called when search bar has lost focus.

#### `onCancelButtonPress`

A callback that gets called when the cancel button is pressed.

#### `onChangeText`

A callback that gets called when the text changes. It receives the current text value of the search bar.

Example:

```js
const [search, setSearch] = React.useState('');

React.useEffect(() => {
  navigation.setOptions({
    searchBar: {
      onChangeText: (event) => setSearch(event.nativeEvent.text),
    }
  });
}, [navigation]);
```

#### `onFocus`

A callback that gets called when search bar has received focus.

#### `onSearchButtonPress`

A callback that gets called when the search button is pressed. It receives the current text value of the search bar.

#### `placeholder`

Text displayed when search field is empty.

Defaults to an empty string.

#### `textColor`

The search field text color.

### Events

The navigator can [emit events](https://reactnavigation.org/docs/navigation-events) on certain actions. Supported events are:

#### `appear` - deprecated

Use `transitionEnd` event with `data.closing: false` instead.

Event which fires when the screen appears.

Example:

```js
React.useEffect(
  () => {
    const unsubscribe = navigation.addListener('appear', e => {
      // Do something
    });

    return unsubscribe;
  },
  [navigation]
);
```

#### `dismiss`

Event which fires when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down).

Example:

```js
React.useEffect(
  () => {
    const unsubscribe = navigation.addListener('dismiss', e => {
      // Do something
    });

    return unsubscribe;
  },
  [navigation]
);
```

#### `transitionStart`

Event which fires when a transition animation starts.

Event data:

- `closing` - Whether the screen will be dismissed or will appear.

Example:

```js
React.useEffect(
  () => {
    const unsubscribe = navigation.addListener('transitionStart', e => {
      if (e.data.closing) {
        // Will be dismissed
      } else {
        // Will appear
      }
    });

    return unsubscribe;
  },
  [navigation]
);
```

#### `transitionEnd`

Event which fires when a transition animation ends.

Event data:

- `closing` - Whether the screen was dismissed or did appear.

Example:

```js
React.useEffect(
  () => {
    const unsubscribe = navigation.addListener('transitionEnd', e => {
      if (e.data.closing) {
        // Was dismissed
      } else {
        // Did appear
      }
    });

    return unsubscribe;
  },
  [navigation]
);
```

### Helpers

The stack navigator adds the following methods to the navigation prop:

#### `push`

Pushes a new screen to the top of the stack and navigate to it. The method accepts the following arguments:

- `name` - _string_ - Name of the route to push onto the stack.
- `params` - _object_ - Screen params to merge into the destination route (found in the pushed screen through `route.params`).

```js
navigation.push('Profile', { name: 'Michaś' });
```

#### `pop`

Pops the current screen from the stack and navigates back to the previous screen. It takes one optional argument (`count`), which allows you to specify how many screens to pop back by.

```js
navigation.pop();
```

#### `popToTop`

Pops all of the screens in the stack except the first one and navigates to it.

```js
navigation.popToTop();
```

## Additional options

### Measuring header's height on iOS

Using translucent header on iOS can result in the need of measuring your header's height. In order to do it, you can use `react-native-safe-area-context`. It can be measured like this:
```js
import { useSafeAreaInsets } from 'react-native-safe-area-context';

...

const statusBarInset = useSafeAreaInsets().top; // inset of the status bar
const smallHeaderInset = statusBarInset + 44; // inset to use for a small header since it's frame is equal to 44 + the frame of status bar
const largeHeaderInset = statusBarInset + 96; // inset to use for a large header since it's frame is equal to 96 + the frame of status bar
```

You can also see an example of using these values with a `ScrollView` here: https://snack.expo.io/@wolewicki/ios-header-height.


## Example

```js
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'tomato' },
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'My profile',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
```
