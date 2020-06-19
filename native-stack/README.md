# Native Stack Navigator

Provides a way for your app to transition between screens where each new screen is placed on top of a stack.

By default the stack navigator is configured to have the familiar iOS and Android look & feel: new screens slide in from the right on iOS, fade in from the bottom on Android. On iOS, the stack navigator can also be configured to a modal style where screens slide in from the bottom.

This navigator uses native navigation primitives (`UINavigationController` on iOS and `Fragment` on Android) for navigation under the hood. The main difference from React Navigation's JS-based [stack navigator](https://reactnavigation.org/docs/stack-navigator.html) is that the JS-based navigator re-implements animations and gestures while the native stack navigator relies on the platform primitives for animations and gestures. You should use this navigator if you want native feeling and performance for navigation and don't need much customization, as the customization options of this navigator are limited.

```sh
npm install react-native-screens @react-navigation/native
```

Make sure to enable `react-native-screens`. This needs to be done before our app renders. To do it, add the following code in your entry file (e.g. `App.js`):

```js
import { enableScreens } from 'react-native-screens';

enableScreens();
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

#### `title`

A string that can be used as a fallback for `headerTitle`.

#### `headerShown`

Whether to show or hide the header for the screen. The header is shown by default. Setting this to `false` hides the header.

#### `headerHideBackButton`

Boolean indicating whether to hide the back button in the header. Only supported on Android.

#### `backButtonInCustomView`

Boolean indicating whether to hide the back button while using `headerLeft` function.

#### `headerHideShadow`

Boolean indicating whether to hide the elevation shadow on the header.

#### `headerTitle`

String to be used by the header as title string. Defaults to scene `title`.

#### `headerBackTitle`

Title string used by the back button on iOS. Defaults to the previous scene's `headerTitle`.

#### `headerBackTitleVisible`

Whether the back button title should be visible or not. Defaults to `true`. Only supported on iOS.

#### `headerRight`

Function which returns a React Element to display on the right side of the header.

#### `headerLeft`

Function which returns a React Element to display on the left side of the header. For now, on Android, using it will cause the title to also disappear.

#### `headerCenter`

Function which returns a React Element to display in the center of the header.

#### `headerTranslucent`

Boolean indicating whether the navigation bar is translucent. Only supported on iOS.

#### `headerTopInsetEnabled`

A Boolean to that lets you opt out of insetting the header. You may want to * set this to `false` if you use an opaque status bar. Defaults to `true`. Insets are always applied on iOS because the header cannot be opaque. Only supported on Android.

#### `headerLargeTitle`

Boolean used to set a native property to prefer a large title header (like in iOS setting).

For the large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`. If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.

Only supported on iOS.

#### `headerTintColor`

Tint color for the header. Changes the color of the back button and title.

#### `headerStyle`

Style object for the header. Supported properties:

- `backgroundColor`

#### `headerTitleStyle`

Style object for header title. Supported properties:

- `fontFamily`
- `fontSize`
- `color`

#### `headerBackTitleStyle`

Style object for header back title. Supported properties:

- `fontFamily`
- `fontSize`

#### `contentStyle`

Style object for the scene content.

#### `gestureEnabled`

Whether you can use gestures to dismiss this screen. Defaults to `true`,

Gestures are only supported on iOS. They can be disabled only when `stackPresentation` is `push`.

#### `stackPresentation`

How the screen should be presented. Possible values:

- `push` - The new screen will be pushed onto a stack. The default animation on iOS is to slide from the side. The animation on Android may vary depending on the OS version and theme.
- `modal` - The new screen will be presented modally. In addition, this allows for a nested stack to be rendered inside such screens
- `transparentModal` - The new screen will be presented modally. In addition, the second to last screen will remain attached to the stack container such that if the top screen is translucent, the content below can still be seen. If `"modal"` is used instead, the below screen gets removed as soon as the transition ends.

Defaults to `push`.

#### `stackAnimation`

How the given screen should appear/disappear when pushed or popped at the top of the stack. Possible values:

- `default` - Uses a platform default animation.
- `fade` - Fades screen in or out.
- `flip` – Flips the screen, requires stackPresentation: `modal` (iOS only).
- `none` - The screen appears/disappears without an animation.

Defaults to `default`.

### Events

The navigator can [emit events](https://reactnavigation.org/docs/navigation-events) on certain actions. Supported events are:

#### `appear`

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

#### `finishTransitioning`

Event which fires when the current screen finishes its transition.

Example:

```js
React.useEffect(
  () => {
    const unsubscribe = navigation.addListener('finishTransitioning', e => {
      // Do something
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
