import {
  DefaultNavigatorOptions,
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  StackNavigationState,
  StackRouterOptions,
  StackActionHelpers,
  RouteProp,
} from '@react-navigation/native';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import {
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ColorValue,
} from 'react-native';
import {
  GestureDetectorBridge,
  ScreenProps,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
} from '../types';

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackNavigationEventMap = {
  /**
   * Event which fires when the screen appears.
   *
   * @deprecated Use `transitionEnd` event with `data.closing: false` instead.
   */
  appear: { data: undefined };
  /**
   * Event which fires when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down).
   */
  dismiss: { data: undefined };
  /**
   * Event which fires when a transition animation starts.
   */
  transitionStart: { data: { closing: boolean } };
  /**
   * Event which fires when a transition animation ends.
   */
  transitionEnd: { data: { closing: boolean } };
  /**
   * Event which fires when a swipe back is canceled on iOS.
   */
  gestureCancel: { data: undefined };
  /**
   * Event which fires when a header height gets changed.
   */
  headerHeightChange: { data: { headerHeight: number } };
  /**
   * Event which fires when screen is in sheet presentation & it's detent changes.
   *
   * In payload it caries two fields:
   *
   * * index - current detent index in the `sheetAllowedDetents` array,
   * * isStable - on Android `false` value means that the user is dragging the sheet or it is settling; on iOS it is always `true`.
   */
  sheetDetentChange: { data: { index: number; isStable: boolean } };
};

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState<ParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
> &
  StackActionHelpers<ParamList>;

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
> = {
  navigation: NativeStackNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackNavigationHelpers = NavigationHelpers<
  ParamListBase,
  NativeStackNavigationEventMap
>;

/**
 * We want it to be an empty object beacuse navigator does not have any additional config
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackNavigationConfig = {}; // eslint-disable-line @typescript-eslint/ban-types

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackNavigationOptions = {
  /**
   * Image to display in the header as the back button.
   * Defaults to back icon image for the platform (a chevron on iOS and an arrow on Android).
   */
  backButtonImage?: ImageSourcePropType;
  /**
   * Whether to show the back button with custom left side of the header.
   */
  backButtonInCustomView?: boolean;
  /**
   * Style object for the scene content.
   *
   * As a workaround to truncated sheet content, formSheet uses backgroundColor from contentStyle and applies it on Screen.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Boolean indicating that swipe dismissal should trigger animation provided by `stackAnimation`. Defaults to `false`.
   *
   * @platform ios
   */
  customAnimationOnSwipe?: boolean;
  /**
   * Whether the stack should be in rtl or ltr form.
   */
  direction?: 'rtl' | 'ltr';
  /**
   * Boolean indicating whether to show the menu on longPress of iOS >= 14 back button.
   * @platform ios
   */
  disableBackButtonMenu?: boolean;
  /**
   * How the back button behaves. It is used only when none of: `backTitleFontFamily`, `backTitleFontSize`, `disableBackButtonMenu` and `backTitleVisible=false` is set.
   * The following values are currently supported (they correspond to [UINavigationItemBackButtonDisplayMode](https://developer.apple.com/documentation/uikit/uinavigationitembackbuttondisplaymode?language=objc)):
   *
   * - `default` – show given back button previous controller title, system generic or just icon based on available space
   * - `generic` – show given system generic or just icon based on available space
   * - `minimal` – show just an icon
   *
   * @platform ios
   */
  backButtonDisplayMode?: ScreenStackHeaderConfigProps['backButtonDisplayMode'];
  /**
   * Whether inactive screens should be suspended from re-rendering. Defaults to `false`.
   * Defaults to `true` when `enableFreeze()` is run at the top of the application.
   */
  freezeOnBlur?: boolean;
  /**
   * Boolean indicating whether the swipe gesture should work on whole screen. Swiping with this option results in the same transition animation as `simple_push` by default.
   * It can be changed to other custom animations with `customAnimationOnSwipe` prop, but default iOS swipe animation is not achievable due to usage of custom recognizer.
   * Defaults to `false`.
   *
   * @platform ios
   */
  fullScreenSwipeEnabled?: boolean;
  /**
   * Whether the full screen dismiss gesture has shadow under view during transition. The gesture uses custom transition and thus
   * doesn't have a shadow by default. When enabled, a custom shadow view is added during the transition which tries to mimic the
   * default iOS shadow. Defaults to `true`.
   *
   * This does not affect the behavior of transitions that don't use gestures, enabled by `fullScreenGestureEnabled` prop.
   *
   * @platform ios
   */
  fullScreenSwipeShadowEnabled?: boolean;
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   * Only supported on iOS.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * Use it to restrict the distance from the edges of screen in which the gesture should be recognized. To be used alongside `fullScreenSwipeEnabled`.
   *
   * @platform ios
   */
  gestureResponseDistance?: ScreenProps['gestureResponseDistance'];
  /**
   * Title to display in the back button.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitle?: string;
  /**
   * Style object for header back title. Supported properties:
   * - fontFamily
   * - fontSize
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
  };
  /**
   * Whether the back button title should be visible or not. Defaults to `true`.
   *
   * When set to `false` it works as a "kill switch": it enforces `backButtonDisplayMode=minimal`, and ignores `backButtonDisplayMode`,
   * `headerBackTitleStyle`, `disableBackButtonMenu`. For `headerBackTitle` it works only in back button menu.
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerBackTitleVisible?: boolean;
  /**
   * Function which returns a React Element to display in the center of the header.
   */
  headerCenter?: (props: { tintColor?: ColorValue }) => React.ReactNode;
  /**
   * Boolean indicating whether to hide the back button in header.
   */
  headerHideBackButton?: boolean;
  /**
   * Boolean indicating whether to hide the elevation shadow or the bottom border on the header.
   */
  headerHideShadow?: boolean;
  /**
   * Controls the style of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar. Supported properties:
   * - backgroundColor
   *
   * @platform ios
   */
  headerLargeStyle?: {
    backgroundColor?: ColorValue;
  };
  /**
   * Boolean to set native property to prefer large title header (like in iOS setting).
   * For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`.
   * If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitle?: boolean;
  /**
   * Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
   */
  headerLargeTitleHideShadow?: boolean;
  /**
   * Style object for header large title. Supported properties:
   * - fontFamily
   * - fontSize
   * - color
   *
   * Only supported on iOS.
   *
   * @platform ios
   */
  headerLargeTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: ColorValue;
  };
  /**
   * Function which returns a React Element to display on the left side of the header.
   */
  headerLeft?: (props: { tintColor?: ColorValue }) => React.ReactNode;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: { tintColor?: ColorValue }) => React.ReactNode;
  /**
   * Whether to show the header.
   */
  headerShown?: boolean;
  /**
   * Style object for header title. Supported properties:
   * - backgroundColor
   * - blurEffect
   */
  headerStyle?: {
    backgroundColor?: ColorValue;
    blurEffect?: ScreenStackHeaderConfigProps['blurEffect'];
  };
  /**
   * Tint color for the header. Changes the color of back button and title.
   */
  headerTintColor?: ColorValue;
  /**
   * String to display in the header as title. Defaults to scene `title`.
   */
  headerTitle?: string;
  /**
   * Style object for header title. Supported properties:
   * - fontFamily
   * - fontSize
   * - fontWeight
   * - color
   */
  headerTitleStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: ColorValue;
  };
  /**
   * A flag to that lets you opt out of insetting the header. You may want to
   * set this to `false` if you use an opaque status bar. Defaults to `true`.
   * Only supported on Android. Insets are always applied on iOS because the
   * header cannot be opaque.
   *
   * @platform android
   */
  headerTopInsetEnabled?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   */
  headerTranslucent?: boolean;
  /**
   * Whether the home indicator should be hidden on this screen. Defaults to `false`.
   *
   * @platform ios
   */
  homeIndicatorHidden?: boolean;
  /**
   * Whether the keyboard should hide when swiping to the previous screen. Defaults to `false`.
   *
   * @platform ios
   */
  hideKeyboardOnSwipe?: boolean;
  /**
   * Boolean indicating whether, when the Android default back button is clicked, the `pop` action should be performed on the native side or on the JS side to be able to prevent it.
   * Unfortunately the same behavior is not available on iOS since the behavior of native back button cannot be changed there.
   * Defaults to `false`.
   *
   * @platform android
   */
  nativeBackButtonDismissalEnabled?: boolean;
  /**
   * Sets the navigation bar color. Defaults to initial status bar color.
   *
   * @platform android
   */
  navigationBarColor?: ColorValue;
  /**
   * Boolean indicating whether the content should be visible behind the navigation bar. Defaults to `false`.
   *
   * @platform android
   */
  navigationBarTranslucent?: boolean;
  /**
   * Sets the visibility of the navigation bar. Defaults to `false`.
   *
   * @platform android
   */
  navigationBarHidden?: boolean;
  /**
   * How should the screen replacing another screen animate. Defaults to `pop`.
   * The following values are currently supported:
   * - "push" – the new screen will perform push animation.
   * - "pop" – the new screen will perform pop animation.
   */
  replaceAnimation?: ScreenProps['replaceAnimation'];
  /**
   * In which orientation should the screen appear.
   * The following values are currently supported:
   * - "default" - resolves to "all" without "portrait_down" on iOS. On Android, this lets the system decide the best orientation.
   * - "all" – all orientations are permitted
   * - "portrait" – portrait orientations are permitted
   * - "portrait_up" – right-side portrait orientation is permitted
   * - "portrait_down" – upside-down portrait orientation is permitted
   * - "landscape" – landscape orientations are permitted
   * - "landscape_left" – landscape-left orientation is permitted
   * - "landscape_right" – landscape-right orientation is permitted
   */
  screenOrientation?: ScreenProps['screenOrientation'];
  /**
   * Object in which you should pass props in order to render native iOS searchBar.
   */
  searchBar?: SearchBarProps;
  /**
   * Describes heights where a sheet can rest.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * Heights should be described as fraction (a number from [0, 1] interval) of screen height / maximum detent height.
   *
   * Please note that the array **must** be sorted in ascending order.
   *
   * Defaults to `[1.0]` literal.
   */
  sheetAllowedDetents?: ScreenProps['sheetAllowedDetents'] | 'fitToContents';
  /**
   * Integer value describing elevation of the sheet, impacting shadow on the top edge of the sheet.
   *
   * Not dynamic.
   *
   * Defaults to `24`.
   *
   * @platform Android
   */
  sheetElevation?: ScreenProps['sheetElevation'];
  /**
   * Whether the sheet should expand to larger detent when scrolling.
   * Works only when `stackPresentation` is set to `formSheet`.
   * Defaults to `true`.
   *
   * @platform ios
   */
  sheetExpandsWhenScrolledToEdge?: ScreenProps['sheetExpandsWhenScrolledToEdge'];
  /**
   * The corner radius that the sheet will try to render with.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * If set to non-negative value it will try to render sheet with provided radius, else it will apply system default.
   *
   * If left unset system default is used.
   */
  sheetCornerRadius?: ScreenProps['sheetCornerRadius'];
  /**
   * Boolean indicating whether the sheet shows a grabber at the top.
   * Works only when `stackPresentation` is set to `formSheet`.
   * Defaults to `false`.
   *
   * @platform ios
   */
  sheetGrabberVisible?: ScreenProps['sheetGrabberVisible'];
  /**
   * Index of the detent the sheet should expand to after being opened.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * Defaults to `0` - which represents first detent in the detents array.
   */
  sheetInitialDetentIndex?: ScreenProps['sheetInitialDetentIndex'];
  /**
   * The largest sheet detent for which a view underneath won't be dimmed.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * This prop can be set to an number, which indicates index of detent in `sheetAllowedDetents` array for which
   * there won't be a dimming view beneath the sheet.
   *
   * Additionaly there are following options available:
   *
   * * `none` - there will be dimming view for all detents levels,
   * * `largest` - there won't be a dimming view for any detent level.
   *
   * There also legacy & **deprecated** prop values available: `medium`, `large` (don't confuse with `largest`), `all`, which work in tandem with
   * corresponding legacy prop values for `sheetAllowedDetents` prop.
   *
   * Defaults to `none`, indicating that the dimming view should be always present.
   */
  sheetLargestUndimmedDetentIndex?: ScreenProps['sheetLargestUndimmedDetentIndex'];
  /**
   * How the screen should appear/disappear when pushed or popped at the top of the stack.
   * The following values are currently supported:
   * - "default" – uses a platform default animation
   * - "fade" – fades screen in or out
   * - "fade_from_bottom" – performs a fade from bottom animation
   * - "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
   * - "simple_push" – performs a default animation, but without native header transition (iOS only)
   * - "slide_from_bottom" – performs a slide from bottom animation
   * - "slide_from_right" - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "slide_from_left" - slide in the new screen from left to right
   * - "ios_from_right" - iOS like slide in animation. pushes in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "ios_from_left" - iOS like slide in animation. pushes in the new screen from left to right (Android only, resolves to default transition on iOS)
   * - "none" – the screen appears/dissapears without an animation
   */
  stackAnimation?: ScreenProps['stackAnimation'];
  /**
   * How should the screen be presented.
   * The following values are currently supported:
   * - "push" – the new screen will be pushed onto a stack which on iOS means that the default animation will be slide from the side, the animation on Android may vary depending on the OS version and theme.
   * - "modal" – the new screen will be presented modally. In addition this allow for a nested stack to be rendered inside such screens.
   * - "transparentModal" – the new screen will be presented modally but in addition the second to last screen will remain attached to the stack container such that if the top screen is non opaque the content below can still be seen. If "modal" is used instead the below screen will get unmounted as soon as the transition ends.
   * - "containedModal" – will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
   * - "containedTransparentModal" – will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
   * - "fullScreenModal" – will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
   * - "formSheet" – will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to "modal" on Android.
   * - "pageSheet" – will use "UIModalPresentationPageSheet" modal style on iOS and will fallback to "modal" on Android.
   */
  stackPresentation?: ScreenProps['stackPresentation'];
  /**
   * Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS.
   */
  statusBarAnimation?: ScreenProps['statusBarAnimation'];
  /**
   * Sets the status bar color (similar to the `StatusBar` component). Defaults to initial status bar color.
   *
   * @platform android
   */
  statusBarColor?: ColorValue;
  /**
   * Whether the status bar should be hidden on this screen. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS. Defaults to `false`.
   */
  statusBarHidden?: boolean;
  /**
   * Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS. Defaults to `auto`.
   */
  statusBarStyle?: ScreenProps['statusBarStyle'];
  /**
   * Sets the translucency of the status bar. Defaults to `false`.
   *
   * @platform android
   */
  statusBarTranslucent?: boolean;
  /**
   * Sets the direction in which you should swipe to dismiss the screen.
   * When using `vertical` option, options `fullScreenSwipeEnabled: true`, `customAnimationOnSwipe: true` and `stackAnimation: 'slide_from_bottom'` are set by default.
   * The following values are supported:
   * - `vertical` – dismiss screen vertically
   * - `horizontal` – dismiss screen horizontally (default)
   * @platform ios
   */
  swipeDirection?: ScreenProps['swipeDirection'];
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Changes the duration (in milliseconds) of `slide_from_bottom`, `fade_from_bottom`, `fade` and `simple_push` transitions on iOS. Defaults to `500`.
   * The duration of `default` and `flip` transitions isn't customizable.
   *
   * @platform ios
   */
  transitionDuration?: number;

  goBackGesture?: GoBackGesture;
  transitionAnimation?: AnimatedScreenTransition;
  screenEdgeGesture?: boolean;
  /**
   * Footer component that can be used alongside form sheet stack presentation style.
   *
   * This option is provided, because due to implementation details it might be problematic
   * to implement such layout with JS-only code.
   *
   * Please note that this prop is marked as unstable and might be subject of breaking changes,
   * even removal.
   *
   * @platform android
   */
  unstable_sheetFooter?: () => React.ReactNode;
};

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackNavigatorProps =
  DefaultNavigatorOptions<NativeStackNavigationOptions> &
    StackRouterOptions &
    NativeStackNavigationConfig;

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackDescriptor = Descriptor<
  ParamListBase,
  string,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions
>;

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type NativeStackDescriptorMap = {
  [key: string]: NativeStackDescriptor;
};

/**
 * Those below copied to src/types.ts should be removed with next minor and native-stack v5 removal
 */

/**
 * copy from GestureHandler to avoid strong dependency
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type PanGestureHandlerEventPayload = {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  translationX: number;
  translationY: number;
  velocityX: number;
  velocityY: number;
};

/**
 * copy from Reanimated to avoid strong dependency
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type GoBackGesture =
  | 'swipeRight'
  | 'swipeLeft'
  | 'swipeUp'
  | 'swipeDown'
  | 'verticalSwipe'
  | 'horizontalSwipe'
  | 'twoDimensionalSwipe';

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export interface MeasuredDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type AnimatedScreenTransition = {
  topScreenStyle: (
    event: PanGestureHandlerEventPayload,
    screenSize: MeasuredDimensions,
  ) => Record<string, unknown>;
  belowTopScreenStyle: (
    event: PanGestureHandlerEventPayload,
    screenSize: MeasuredDimensions,
  ) => Record<string, unknown>;
};

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type ScreensRefsHolder = React.MutableRefObject<
  Record<string, React.MutableRefObject<React.Ref<React.Component>>>
>;

/**
 * @deprecated NativeStack has been moved from react-native-screens/native-stack to @react-navigation/native since version v6. With react-native-screens v4 native stack v5 (react-native-screens/native-stack) is deprecated and marked for removal in the upcoming minor release, react-native-screens v4 will support only @react-navigation/native-stack v7.
 */
export type GestureProviderProps = PropsWithChildren<{
  gestureDetectorBridge: React.MutableRefObject<GestureDetectorBridge>;
  screensRefs: ScreensRefsHolder;
  currentRouteKey: string;
  goBackGesture: GoBackGesture | undefined;
  transitionAnimation: AnimatedScreenTransition | undefined;
  screenEdgeGesture: boolean | undefined;
}>;
