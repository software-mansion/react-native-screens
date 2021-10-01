import {
  Animated,
  NativeSyntheticEvent,
  ViewProps,
  View,
  TargetedEvent,
  TextInputFocusEventData,
} from 'react-native';

export type StackPresentationTypes =
  | 'push'
  | 'modal'
  | 'transparentModal'
  | 'containedModal'
  | 'containedTransparentModal'
  | 'fullScreenModal'
  | 'formSheet';
export type StackAnimationTypes =
  | 'default'
  | 'fade'
  | 'fade_from_bottom'
  | 'flip'
  | 'none'
  | 'simple_push'
  | 'slide_from_bottom'
  | 'slide_from_right'
  | 'slide_from_left';
export type BlurEffectTypes =
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';
export type ScreenReplaceTypes = 'push' | 'pop';
export type ScreenOrientationTypes =
  | 'default'
  | 'all'
  | 'portrait'
  | 'portrait_up'
  | 'portrait_down'
  | 'landscape'
  | 'landscape_left'
  | 'landscape_right';
export type HeaderSubviewTypes =
  | 'back'
  | 'right'
  | 'left'
  | 'center'
  | 'searchBar';

export type TransitionProgressEventType = {
  progress: number;
  closing: number;
  goingForward: number;
};

export interface ScreenProps extends ViewProps {
  active?: 0 | 1 | Animated.AnimatedInterpolation;
  activityState?: 0 | 1 | 2 | Animated.AnimatedInterpolation;
  children?: React.ReactNode;
  /**
   * Boolean indicating that swipe dismissal should trigger animation provided by `stackAnimation`. Defaults to `false`.
   *
   * @platform ios
   */
  customAnimationOnSwipe?: boolean;
  /**
   * All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
  /**
   * Internal boolean used to not attach events used only by native-stack. It prevents non native-stack navigators from sending transition progress from their Screen components.
   */
  isNativeStack?: boolean;
  /**
   * Boolean indicating whether the swipe gesture should work on whole screen. Swiping with this option results in the same transition animation as `simple_push` by default.
   * It can be changed to other custom animations with `customAnimationOnSwipe` prop, but default iOS swipe animation is not achievable due to usage of custom recognizer.
   * Defaults to `false`.
   *
   * @platform ios
   */
  fullScreenSwipeEnabled?: boolean;
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * Boolean indicating whether, when the Android default back button is clicked, the `pop` action should be performed on the native side or on the JS side to be able to prevent it.
   * Unfortunately the same behavior is not available on iOS since the behavior of native back button cannot be changed there.
   * Defaults to `false`.
   *
   * @platform android
   */
  nativeBackButtonDismissalEnabled?: boolean;
  /**
   * A callback that gets called when the current screen appears.
   */
  onAppear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onComponentRef?: (view: unknown) => void;
  /**
   * A callback that gets called when the current screen disappears.
   */
  onDisappear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down).
   * The callback takes the number of dismissed screens as an argument since iOS 14 native header back button can pop more than 1 screen at a time.
   */
  onDismissed?: (e: NativeSyntheticEvent<{ dismissCount: number }>) => void;
  /**
   * An internal callback that gets called when the native header back button is clicked on Android and `enableNativeBackButtonDismissal` is set to `false`. It dismises the screen using `navigation.pop()`.
   *
   * @platform android
   */
  onHeaderBackButtonClicked?: () => void;
  /**
   * An internal callback called every frame during the transition of screens of `native-stack`, used to feed transition context.
   */
  onTransitionProgress?: (
    e: NativeSyntheticEvent<TransitionProgressEventType>
  ) => void;
  /**
   * A callback that gets called when the current screen will appear. This is called as soon as the transition begins.
   */
  onWillAppear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the current screen will disappear. This is called as soon as the transition begins.
   */
  onWillDisappear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  ref?: React.Ref<View>;
  /**
   * How should the screen replacing another screen animate. Defaults to `pop`.
   * The following values are currently supported:
   * - "push" – the new screen will perform push animation.
   * - "pop" – the new screen will perform pop animation.
   */
  replaceAnimation?: ScreenReplaceTypes;
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
  screenOrientation?: ScreenOrientationTypes;
  /**
   * How the screen should appear/disappear when pushed or popped at the top of the stack.
   * The following values are currently supported:
   * - "default" – uses a platform default animation
   * - "fade" – fades screen in or out
   * - "fade_from_bottom" – performs a fade from bottom animation
   * - "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
   * - "simple_push" – performs a default animation, but without shadow and native header transition (iOS only)
   * - `slide_from_bottom` – performs a slide from bottom animation
   * - "slide_from_right" - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "slide_from_left" - slide in the new screen from left to right (Android only, resolves to default transition on iOS)
   * - "none" – the screen appears/dissapears without an animation
   */
  stackAnimation?: StackAnimationTypes;
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
   */
  stackPresentation?: StackPresentationTypes;
  /**
   * Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS.
   */
  statusBarAnimation?: 'none' | 'fade' | 'slide';
  /**
   * Sets the status bar color (similar to the `StatusBar` component). Defaults to initial status bar color.
   *
   * @platform android
   */
  statusBarColor?: string;
  /**
   * Whether the status bar should be hidden on this screen. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS. Defaults to `false`.
   */
  statusBarHidden?: boolean;
  /**
   * Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS. Defaults to `auto`.
   */
  statusBarStyle?: 'inverted' | 'auto' | 'light' | 'dark';
  /**
   * Sets the translucency of the status bar. Defaults to `false`.
   *
   * @platform android
   */
  statusBarTranslucent?: boolean;
}

export interface ScreenContainerProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * A prop that gives users an option to switch between using Screens for the navigator (container). All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
  /**
   * A prop to be used in navigators always showing only one screen (providing only `0` or `2` `activityState` values) for better implementation of `ScreenContainer` on iOS.
   */
  hasTwoStates?: boolean;
}

export interface ScreenStackProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * A callback that gets called when the current screen finishes its transition.
   */
  onFinishTransitioning?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
}

export interface ScreenStackHeaderConfigProps extends ViewProps {
  /**
   * Whether to show the back button with custom left side of the header.
   */
  backButtonInCustomView?: boolean;
  /**
   * Controls the color of the navigation header.
   */
  backgroundColor?: string;
  /**
   * Title to display in the back button.
   * @platform ios.
   */
  backTitle?: string;
  /**
   * Allows for customizing font family to be used for back button title on iOS.
   * @platform ios
   */
  backTitleFontFamily?: string;
  /**
   * Allows for customizing font size to be used for back button title on iOS.
   * @platform ios
   */
  backTitleFontSize?: number;
  /**
   * Blur effect to be applied to the header. Works with backgroundColor's alpha < 1.
   * @platform ios
   */
  blurEffect?: BlurEffectTypes;
  /**
   * Pass HeaderLeft, HeaderRight and HeaderTitle
   */
  children?: React.ReactNode;
  /**
   * Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color use titleColor property.
   */
  color?: string;
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
   * When set to true the header will be hidden while the parent Screen is on the top of the stack. The default value is false.
   */
  hidden?: boolean;
  /**
   * Boolean indicating whether to hide the back button in header.
   */
  hideBackButton?: boolean;
  /**
   * Boolean indicating whether to hide the elevation shadow or the bottom border on the header.
   */
  hideShadow?: boolean;
  /**
   * Boolean to set native property to prefer large title header (like in iOS setting).
   * For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`.
   * If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.
   * Only supported on iOS.
   *
   * @platform ios
   */
  largeTitle?: boolean;
  /**
   * Controls the color of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
   */
  largeTitleBackgroundColor?: string;
  /**
   * Customize the color to be used for the large title. By default uses the titleColor property.
   * @platform ios
   */
  largeTitleColor?: string;
  /**
   * Customize font family to be used for the large title.
   * @platform ios
   */
  largeTitleFontFamily?: string;
  /**
   * Customize the size of the font to be used for the large title.
   * @platform ios
   */
  largeTitleFontSize?: number;
  /**
   * Customize the weight of the font to be used for the large title.
   * @platform ios
   */
  largeTitleFontWeight?: string;
  /**
   * Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
   */
  largeTitleHideShadow?: boolean;
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Allows for setting text color of the title.
   */
  titleColor?: string;
  /**
   * Customize font family to be used for the title.
   */
  titleFontFamily?: string;
  /**
   * Customize the size of the font to be used for the title.
   */
  titleFontSize?: number;
  /**
   * Customize the weight of the font to be used for the title.
   */
  titleFontWeight?: string;
  /**
   * A flag to that lets you opt out of insetting the header. You may want to
   * set this to `false` if you use an opaque status bar. Defaults to `true`.
   * Only supported on Android. Insets are always applied on iOS because the
   * header cannot be opaque.
   *
   * @platform android
   */
  topInsetEnabled?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   */
  translucent?: boolean;
}

export interface SearchBarProps {
  /**
   * The auto-capitalization behavior
   */
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  /**
   * The search field background color
   */
  barTintColor?: string;
  /**
   * The text to be used instead of default `Cancel` button text
   */
  cancelButtonText?: string;

  /**
   * Indicates whether to hide the navigation bar
   */
  hideNavigationBar?: boolean;
  /**
   * Indicates whether to hide the search bar when scrolling
   */
  hideWhenScrolling?: boolean;

  /**
   * Indicates whether to to obscure the underlying content
   */
  obscureBackground?: boolean;
  /**
   * A callback that gets called when search bar has lost focus
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the cancel button is pressed
   */
  onCancelButtonPress?: (e: NativeSyntheticEvent<TargetedEvent>) => void;

  /**
   * A callback that gets called when the text changes. It receives the current text value of the search bar.
   */
  onChangeText?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * A callback that gets called when search bar has received focus
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the search button is pressed. It receives the current text value of the search bar.
   */
  onSearchButtonPress?: (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => void;
  /**
   * Text displayed when search field is empty
   */
  placeholder?: string;
  /**
   * The search field text color
   */
  textColor?: string;
}
