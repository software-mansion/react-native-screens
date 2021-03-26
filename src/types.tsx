import {
  Animated,
  NativeSyntheticEvent,
  NativeTouchEvent,
  ViewProps,
  View,
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
  | 'flip'
  | 'none'
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
export type HeaderSubviewTypes = 'back' | 'right' | 'left' | 'center';

export interface ScreenProps extends ViewProps {
  active?: 0 | 1 | Animated.AnimatedInterpolation;
  activityState?: 0 | 1 | 2 | Animated.AnimatedInterpolation;
  children?: React.ReactNode;
  /**
   * All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   * Only supported on iOS.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * A callback that gets called when the current screen appears.
   */
  onAppear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  onComponentRef?: (view: unknown) => void;
  /**
   * A callback that gets called when the current screen disappears.
   */
  onDisappear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  /**
   * A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down). The callback takes no arguments.
   */
  onDismissed?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  /**
   * A callback that gets called when the current screen will appear. This is called as soon as the transition begins.
   */
  onWillAppear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  /**
   * A callback that gets called when the current screen will disappear. This is called as soon as the transition begins.
   */
  onWillDisappear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  ref?: React.Ref<View>;
  /**
   * How should the screen replacing another screen animate. Defaults to `pop`.
   * The following values are currently supported:
   * - "push" – the new screen will perform push animation.
   * - "pop" – the new screen will perform pop animation.
   */
  replaceAnimation?: ScreenReplaceTypes;
  /**
   * How the screen should appear/disappear when pushed or popped at the top of the stack.
   * The following values are currently supported:
   * - "default" – uses a platform default animation
   * - "fade" – fades screen in or out
   * - "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
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
}

export interface ScreenContainerProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * A prop that gives users an option to switch between using Screens for the navigator (container). All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
}

export interface ScreenStackProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * A callback that gets called when the current screen finishes its transition.
   */
  onFinishTransitioning?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
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
   * Only supported on iOS.
   *
   *
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
   * Whether the stack should be in rtl or ltr form.
   */
  direction?: 'rtl' | 'ltr';
  /**
   * When set to true the header will be hidden while the parent Screen is on the top of the stack. The default value is false.
   */
  hidden?: boolean;
  /**
   * Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color use titleColor property.
   */
  color?: string;
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
   * Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.
   *
   * @platform ios
   */
  statusBarAnimation?: 'none' | 'fade' | 'slide';
  /**
   * Whether the status bar should be hidden on this screen. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.
   *
   * @platform ios
   */
  statusBarHidden?: boolean;
  /** Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file.
   *
   * @platform ios
   */
  statusBarStyle?: 'inverted' | 'auto' | 'light' | 'dark';
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
